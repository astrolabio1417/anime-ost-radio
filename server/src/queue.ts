import ffmpegFluent from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { randomUUID } from 'crypto'
import { PassThrough } from 'stream'
import Throttle from 'throttle'
import fs from 'fs'
import { USER_AGENT } from './data/constant'
import { sleep } from './helpers/sleep'
import SongModel, { ISong } from './models/songModel'
import { checkObjectId } from './helpers/checkObjectId'
import { FilterQuery, SortOrder } from 'mongoose'
import { download, tmpPath } from './downloader'
import EventEmitter from 'events'
import { escapeFilename } from './helpers/escapeFilename'

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
    index: number
    isPlaying: boolean
    stream: fs.ReadStream | undefined
    userAgent: string
    throttle: Throttle | undefined
    bitrate: number
    timemark: number

    constructor() {
        super()
        this.currentTrack = ''
        this.clients = new Map()
        this.index = 0
        this.isPlaying = false
        this.bitrate = 128 // 320 // 128 // 320
        this.userAgent = USER_AGENT
        this.timemark = 0
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
        this.clients.forEach(client => {
            client.write(chunk)
        })
    }

    async priorityBroadcast(readStream: fs.ReadStream) {
        this.pause()
        await sleep(10000)
        const throttle = new Throttle((this.bitrate * 1000) / 8)
        this.encodeReadStream(readStream, this.bitrate)
            .pipe(throttle)
            .on('data', chunk => {
                console.log({ chunk })
                this.broadcast(chunk)
            })
            .on('close', () => this.play())
            .on('error', () => this.play())
    }

    async queue(limit: number = 10) {
        return await SongModel.find(getQueueOption(this.currentTrack)).sort(QueueSort).limit(limit)
    }

    async getNextTrack() {
        return await SongModel.findOne(getQueueOption(this.currentTrack)).sort(QueueSort)
    }

    async rotateTracks() {
        console.debug('[func]: Rotate Tracks')

        if (this.currentTrack) {
            console.debug('[func]: set current track to played')
            await SongModel.findByIdAndUpdate(this.currentTrack, {
                $set: { 'vote.list': [], 'vote.total': 0, played: true },
                $unset: { 'vote.timestamp': true },
            })
        }

        console.debug('[func]: setting next track')
        const nextTrack = await this.getNextTrack()
        this.currentTrack = nextTrack?.id?.toString() ?? ''
        console.debug(`[func]: next track: ${nextTrack?.name} ${nextTrack?._id}`)

        if (!nextTrack) {
            console.debug('[func]: reset all song to played = false')
            // reset tracks
            await SongModel.updateMany({ played: false }, { $set: { played: true } })
            await sleep(3000)
            await this.rotateTracks()
            return
        }
        this.emit(QUEUE_EVENTS.ON_TRACK_CHANGE, nextTrack)
        this.emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, await this.queue(20))
        await this.loadTrackStream()
    }

    async play() {
        if (!this.getCurrentTrack()) await this.rotateTracks()
        if (!this.stream) {
            const loaded = await this.loadTrackStream()
            if (!loaded) {
                await this.rotateTracks()
                await this.play()
                return
            }
        }
        await this.startBroadcast()
    }

    pause() {
        if (!this.throttle || !this.isPlaying) return
        this.isPlaying = false
        this.throttle.removeAllListeners('end')
        this.throttle.end()
    }

    async loadTrackStream() {
        console.log('trying to load track stream ------------------------------------')
        const track = await this.getCurrentTrack()
        if (!track?.musicUrl) return
        const stream = await this.createTrackReadStream(track.musicUrl, track.name)
        if (!stream) return (this.stream = undefined)
        return (this.stream = stream)
    }

    async startBroadcast() {
        const track = await this.getCurrentTrack()

        if (!track || !this.stream) {
            console.debug('[func]: rotating for track')
            await sleep(5000)
            await this.rotateTracks()
            await this.play()
            return
        }

        console.log(`Playing ${track.name} by ${track.artist} | `, ` bitrate: ${this.bitrate}`)
        this.isPlaying = true
        this.throttle = new Throttle((this.bitrate * 1000) / 8)
        this.stream
            .pipe(this.throttle)
            .on('data', chunk => {
                this.broadcast(chunk)
            })
            .on('end', () => {
                this.rotateTracks().then(() => this.play())
            })
            .on('error', () => {
                this.rotateTracks().then(() => this.play())
            })
    }

    encodeReadStream(stream: fs.ReadStream, bitrate: number = 320) {
        const ffmpegStream = ffmpegFluent(stream)
            .setFfmpegPath(ffmpegPath ?? '')
            .format('mp3')
            .noVideo()
            .audioBitrate(bitrate)
            .audioChannels(2)
            .audioFrequency(44100)
            .audioFilters([
                {
                    filter: 'volume',
                    options: ['0.5'],
                },
                {
                    filter: 'silencedetect',
                    options: { n: '-50dB', d: 5 },
                },
            ])
            .on('progress', data => {
                console.log('ffmpeg encoding Progress: ', data)
            })
            .on('error', err => {
                console.error(err)
            })

        return ffmpegStream
    }

    setTimemark(timemark: number) {
        this.timemark = timemark
        this.emit(QUEUE_EVENTS.ON_TIME_CHANGE, timemark)
    }

    async createTrackReadStream(path: string, name: string) {
        if (!/^(https|http):\/\//gi.test(path)) {
            if (!fs.existsSync(path)) return
            return fs.createReadStream(path)
        }

        let url: URL | null = null

        try {
            url = new URL(path)
        } catch (e) {
            console.error(e)
        }

        if (!url) return
        const filename = escapeFilename(name.substring(0, 220))
        const encodedFilename = `${tmpPath}/${filename}-encoded.mp3`

        if (fs.existsSync(encodedFilename)) {
            return fs.createReadStream(encodedFilename).on('close', () => fs.unlinkSync(encodedFilename))
        }

        const readableStream = await download(path, filename + '.mp3')
        if (!readableStream) return
        const encoded = await new Promise<boolean>((resolve, reject) => {
            const writeStream = fs.createWriteStream(encodedFilename)
            this.encodeReadStream(readableStream, this.bitrate)
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
