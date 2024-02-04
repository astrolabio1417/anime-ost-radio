import { PassThrough } from 'stream'
import { sleep } from './helpers/sleep'
import SongModel, { ISong, SongDocument } from './models/songModel'
import { checkObjectId } from './helpers/checkObjectId'
import { FilterQuery, SortOrder } from 'mongoose'
import { download } from './downloader'
import EventEmitter from 'events'
import { escapeFilename } from './helpers/escapeFilename'
import { streamMultiToLive, streamToLive } from './encoder'
import Ffmpeg from 'fluent-ffmpeg'

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
    isPlaying: boolean
    bitrate: number
    timemark: number

    stream: Ffmpeg.FfmpegCommand | undefined
    priorityStream?: PassThrough

    constructor() {
        super()
        this.currentTrack = ''
        this.isPlaying = false
        this.bitrate = 320 // 320 // 128 // 320
        this.timemark = 0
    }

    async getCurrentTrack() {
        if (!this.currentTrack) return
        return await SongModel.findById(this.currentTrack).catch(e => console.error(e))
    }

    getTracks() {
        return SongModel.find()
    }


    async queue(limit: number = 10) {
        return await SongModel.find(getQueueOption(this.currentTrack)).sort(QueueSort).limit(limit)
    }

    async getNextTrack() {
        return await SongModel.findOne(getQueueOption(this.currentTrack)).sort(QueueSort)
    }

    async rotateTrack(): Promise<SongDocument> {
        console.log('--- rotating tracks ---')

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.stream?.kill()

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

        return nextTrack
    }

    stop() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.stream?.kill()
        this.stream = undefined
        this.isPlaying = false
    }

    async play() {
        this.isPlaying = true

        if (this.stream) {
            this.stream.kill('SIGCONT')
            return
        }

        this.startBroadcast()
    }

    pause() {
        this.isPlaying = false
        if (!this.stream) return
        this.stream.kill('SIGSTOP')
    }

    async playRandom() {
        this.stop()
        const stream = await streamMultiToLive([''])
        stream.on("end", () => this.play()).on("error", () => this.play())
    }

    async startBroadcast() {
        if (!this.isPlaying) return console.log('--- not playing, stopping the radio broadcast ---')

        const track = await this.getCurrentTrack()

        if (!track?.musicUrl) {
            console.log('--- no track to play, rotating is 5 secs ---')
            await sleep(5000)
            await this.rotateTrack()
            await this.startBroadcast()
            return
        }

        console.log(`Playing ${track.name} by ${track.artist}`)
        console.log('--- starting radio stream ---')
        const filePath = await this.download(track.musicUrl, track.name)

        if (!filePath) {
            this.rotateTrack()
            this.startBroadcast()
            return
        }

        this.stream = (await streamToLive(filePath)).on("end", () => {
            console.log("--- finished playing --- ")
            console.log(track.name)
            this.rotateTrack().then(() => this.startBroadcast())
        }).on("error", (e) => {
            console.error(e)
            console.log("--- error while playing ---")
            console.log(track.name)
            sleep(5000).then(() => this.startBroadcast())
            // this.rotateTrack().then(() => this.startBroadcast())
        }) // TODO  
    }

    setTimemark(timemark: number) {
        this.timemark = timemark
        this.emit(QUEUE_EVENTS.ON_TIME_CHANGE, timemark)
    }

    async download(url: string, name: string): Promise<string | undefined> {
        const filename = escapeFilename(name.substring(0, 220))
        const filePath = await download(url, filename + '.mp3')
        return filePath
    }
}

const queue = new Queue()

export { Queue, queue }
