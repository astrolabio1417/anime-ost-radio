import { randomUUID } from 'crypto'
import { PassThrough, Readable } from 'stream'
import Throttle from 'throttle'
import fs from 'fs'
import { sleep } from './helpers/sleep'
import SongModel, { ISong, SongDocument } from './models/songModel'
import { checkObjectId } from './helpers/checkObjectId'
import { FilterQuery, SortOrder } from 'mongoose'
import { download, tmpPath } from './downloader'
import EventEmitter from 'events'
import { escapeFilename } from './helpers/escapeFilename'
import encodeReadStream from './encoder'

const QueueSort: {
    [key: string]: SortOrder | { $meta: any }
} = {
    'vote.total': -1,
    'vote.timestamp': 'asc',
    _id: -1,
}
const getQueueOption = (id: string) =>
    ({
        ...(checkObjectId(id) ? { _id: { $ne: id } } : {}),
        $or: [{ played: false }, { 'vote.total': { $gte: 1 } }],
    }) as FilterQuery<ISong>

export enum QUEUE_EVENTS {
    ON_TRACK_CHANGE = 'ON_TRACK_CHANGE',
    ON_TIME_CHANGE = 'ON_TIME_CHANGE',
    ON_QUEUE_CHANGE = 'ON_QUEUE_CHANGE',
}

class Queue extends EventEmitter {
    currentTrack: string
    clients: Map<string, PassThrough>
    isPlaying: boolean
    bitrate: number
    timemark: number
    isPriorityStreaming: boolean

    stream: fs.ReadStream | undefined
    throttle: Throttle | undefined
    priorityStream?: PassThrough

    constructor() {
        super()
        this.currentTrack = ''
        this.clients = new Map()
        this.isPlaying = false
        this.bitrate = 320 // 320 // 128 // 320
        this.timemark = 0
        this.isPriorityStreaming = false
        console.log('start', this.priorityStream)
    }

    async getCurrentTrack() {
        if (!this.currentTrack) return
        return await SongModel.findById(this.currentTrack).catch(e => console.error(e))
    }

    getTracks() {
        return SongModel.find()
    }

    addClient() {
        const id = randomUUID()
        const client = new PassThrough()
        this.clients.set(id, client)
        return { id, client }
    }

    removeClient(id: string) {
        this.clients.delete(id)
    }

    broadcast(chunk: any) {
        this.clients.forEach(client => client.write(chunk))
    }

    async queue(limit: number = 10) {
        return await SongModel.find(getQueueOption(this.currentTrack)).sort(QueueSort).limit(limit)
    }

    async getNextTrack() {
        return await SongModel.findOne(getQueueOption(this.currentTrack)).sort(QueueSort)
    }

    async rotateTrack(): Promise<SongDocument> {
        console.log('--- rotating tracks ---')

        if (this.currentTrack) {
            console.log('--- clearing vote list ---')
            await SongModel.findByIdAndUpdate(this.currentTrack, {
                $set: { 'vote.list': [], 'vote.total': 0, played: true },
                $unset: { 'vote.timestamp': true },
            })
        }

        console.log('--- get next track ---')
        const nextTrack = await this.getNextTrack()
        this.currentTrack = nextTrack?.id?.toString() ?? ''

        if (!nextTrack) {
            console.log('--- no more tracks, resetting played flags ---')
            await SongModel.updateMany({ played: false }, { $set: { played: true } })
            await sleep(3000)
            return this.rotateTrack()
        }

        this.emit(QUEUE_EVENTS.ON_TRACK_CHANGE, nextTrack)
        this.emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, await this.queue(20))
        if (!nextTrack.musicUrl) throw `No music url for ${nextTrack.name} by ${nextTrack.artist} #${nextTrack._id}`
        await this.loadTrackStream(nextTrack.musicUrl, nextTrack.name)
        return nextTrack
    }

    async play() {
        if (this.isPriorityStreaming) return console.log('priority stream is running!')
        this.isPlaying = true
        this.startBroadcast()
    }

    pause() {
        this.isPlaying = false
        this.throttle?.removeAllListeners('end')
        this.throttle?.end()
    }

    async loadTrackStream(url: string, name: string) {
        console.log('--- loading track stream ---')
        if (!url || !name) return
        const stream = await this.createTrackReadStream(url, name)
        return (this.stream = stream)
    }

    async startBroadcast() {
        const track = await this.getCurrentTrack()

        if (!track || !this.stream) {
            console.log('--- no track to play, rotating is 5 secs ---')
            await sleep(5000)
            await this.rotateTrack()
            await this.play()
            return
        }

        if (!this.isPlaying) return console.log('--- not playing, stopping the radio broadcast ---')
        console.log(`Playing ${track.name} by ${track.artist} | `, ` bitrate: ${this.bitrate}`)
        this.throttle = new Throttle((this.bitrate * 1000) / 8)
        console.log('--- starting radio stream ---')
        this.stream
            .pipe(this.throttle)
            .on('data', chunk => this.broadcast(chunk))
            .on('end', () => this.rotateTrack().then(() => this.play()))
            .on('error', e => {
                console.error(e)
                this.play()
            })
    }

    setTimemark(timemark: number) {
        this.timemark = timemark
        this.emit(QUEUE_EVENTS.ON_TIME_CHANGE, timemark)
    }

    async createTrackReadStream(path: string, name: string) {
        const filename = escapeFilename(name.substring(0, 220))
        const encodedFilename = `${tmpPath}/${filename}-encoded.mp3`

        if (fs.existsSync(encodedFilename)) {
            return fs.createReadStream(encodedFilename).on('close', () => fs.unlinkSync(encodedFilename))
        }

        const readableStream = await download(path, filename + '.mp3')
        if (!readableStream) return
        const encoded = await new Promise<boolean>((resolve, reject) => {
            const writeStream = fs.createWriteStream(encodedFilename)
            encodeReadStream(readableStream, this.bitrate)
                .pipe(writeStream)
                .on('close', () => resolve(true))
                .on('error', e => {
                    console.error(e)
                    reject(false)
                })
        })
        const encodedReadStream = fs.createReadStream(encodedFilename).on('close', () => fs.unlinkSync(encodedFilename))
        return encoded ? encodedReadStream : undefined
    }
}

const queue = new Queue()

export { Queue, queue }
