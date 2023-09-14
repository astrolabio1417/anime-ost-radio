import express, { Express } from 'express'
import cors from 'cors'
import schedule from 'node-schedule'
import dotenv from 'dotenv'
import http from 'http'
import { Server as IOServer } from 'socket.io'
import mongoose from 'mongoose'
import { cleanSongModel } from './src/models/songModel'
import { QUEUE_EVENTS, queue } from './src/queue'
import { runAllanimeSongJob } from './src/songUpdateScheduler'
import cookieSession from 'cookie-session'
import authRoutes from './src/routes/authRoutes'
import { initRoleModel } from './src/models/roleModel'
import userPlaylistRoutes from './src/routes/playlistRoutes'
import songRoutes from './src/routes/songRoutes'
import streamRoutes from './src/routes/streamRoutes'
import artistRoutes from './src/routes/artistRoutes'

process.on('SIGINT', function () {
    schedule.gracefulShutdown().then(() => process.exit(0))
})

dotenv.config()
const mongoString: string | undefined = process.env.DATABASE_URL ?? ''
const sessionKeys = process.env.SECRET_KEY?.split(',') ?? ['generate-key-1']
const origin = process.env.ORIGINS?.split(',') ?? ['http://localhost:5173', 'http://localhost:8000']
const port = process.env.PORT
const app: Express = express()

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(cookieSession({ name: 'session', keys: sessionKeys, httpOnly: true }))

const corsOption = { cors: { origin } }
const server = http.createServer(app)
export const io = new IOServer(server, corsOption)
;(async () => {
    console.info('Connecting to Database...')
    const database = mongoose.connection
    database.on('error', error => console.error(error))
    database.once('connected', () => {
        console.log('Database Connected')
        runAllanimeSongJob()
        initRoleModel()
    })
    await mongoose.connect(mongoString)

    await cleanSongModel() // clean up old music list
    queue.play() // run radio

    queue.on(QUEUE_EVENTS.ON_TIME_CHANGE, timemark => io.emit(QUEUE_EVENTS.ON_TIME_CHANGE, timemark))
    queue.on(QUEUE_EVENTS.ON_TRACK_CHANGE, track => io.emit(QUEUE_EVENTS.ON_TRACK_CHANGE, track))
    queue.on(QUEUE_EVENTS.ON_QUEUE_CHANGE, track => io.emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, track))

    io.on('connection', async socket => {
        io.to(socket.id).emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, await queue.queue(20))
        io.to(socket.id).emit(QUEUE_EVENTS.ON_TRACK_CHANGE, await queue.getCurrentTrack())
        io.to(socket.id).emit(QUEUE_EVENTS.ON_TIME_CHANGE, queue.timemark)
    })

    streamRoutes(app)
    songRoutes(app)
    authRoutes(app)
    userPlaylistRoutes(app)
    artistRoutes(app)

    app.get('/', (req, res) => {
        res.send('Express')
    })

    server.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`)
    })
})()