import express, { Express } from 'express'
import cors from 'cors'
import schedule from 'node-schedule'
import dotenv from 'dotenv'
import http from 'http'
import { Server as IOServer } from 'socket.io'
import mongoose from 'mongoose'
import { QUEUE_EVENTS, queue } from './src/queue'
import cookieSession from 'cookie-session'
import authRoutes from './src/routes/authRoutes'
import { initRoleModel } from './src/models/roleModel'
import userPlaylistRoutes from './src/routes/playlistRoutes'
import songRoutes from './src/routes/songRoutes'
import streamRoutes from './src/routes/streamRoutes'
import artistRoutes from './src/routes/artistRoutes'
import cookieParser from 'cookie-parser'
import showRoutes from './src/routes/showRotues'
import { authUserToken } from './src/middlewares/authJwt'
import errorHandlerMiddleware from './src/middlewares/errorHandlerMiddleware'

process.on('SIGINT', function () {
    schedule.gracefulShutdown().then(() => process.exit(0))
})

dotenv.config()
const mongoString: string | undefined = process.env.DATABASE_URL ?? ''
const sessionKeys = process.env.SECRET_KEY?.split(',') ?? ['generate-key-1']
const origin = process.env.ORIGINS?.split(',') ?? ['http://localhost:5173', 'http://localhost:8000']
const port = process.env.PORT ?? 8000
const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ credentials: true, origin: origin }))
app.use(cookieSession({ name: 'session', keys: sessionKeys, httpOnly: true }))
app.use(cookieParser())
app.use(authUserToken)

const corsOption = { cors: { origin } }
const server = http.createServer(app)
export const io = new IOServer(server, corsOption)

console.info('Connecting to Database...')

const database = mongoose.connection
database.on('error', error => console.error(error))

database.once('connected', () => {
    console.log('Database Connected')
    initRoleModel()
})

mongoose.connect(mongoString).then(() => {
    // play radio
    queue.play()

    const listenerPeers: Set<string> = new Set()
    queue.on(QUEUE_EVENTS.ON_TIME_CHANGE, timemark => io.emit(QUEUE_EVENTS.ON_TIME_CHANGE, timemark))
    queue.on(QUEUE_EVENTS.ON_TRACK_CHANGE, track => io.emit(QUEUE_EVENTS.ON_TRACK_CHANGE, track))
    queue.on(QUEUE_EVENTS.ON_QUEUE_CHANGE, track => io.emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, track))

    io.on('connection', async socket => {
        io.to(socket.id).emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, await queue.queue(20))
        io.to(socket.id).emit(QUEUE_EVENTS.ON_TRACK_CHANGE, await queue.getCurrentTrack())
        io.to(socket.id).emit(QUEUE_EVENTS.ON_TIME_CHANGE, queue.timemark)

        socket.on('listeners', () => {
            io.to(socket.id).emit('update-user-list', { users: [...listenerPeers].filter(s => s !== socket.id) })
        })

        socket.on('listen', () => {
            listenerPeers.add(socket.id)
            socket.broadcast.emit('add-user', { user: socket.id })
        })

        socket.on('unlisten', onDisconnect)
        socket.on('disconnect', onDisconnect)

        socket.on('call-user', (data: { offer: RTCSessionDescriptionInit; to: string }) => {
            socket.to(data.to).emit('call-made', { offer: data.offer, socket: socket.id })
        })

        socket.on('make-answer', (data: { answer: RTCSessionDescriptionInit; to: string }) => {
            socket.to(data.to).emit('answer-made', { answer: data.answer, socket: socket.id })
        })

        function onDisconnect() {
            listenerPeers.delete(socket.id)
            socket.broadcast.emit('remove-user', { user: socket.id })
        }
    })

    app.use(streamRoutes)
    app.use(songRoutes)
    app.use(authRoutes)
    app.use(userPlaylistRoutes)
    app.use(artistRoutes)
    app.use(showRoutes)

    // error handler
    app.use(errorHandlerMiddleware)

    server.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`)
    })
})
