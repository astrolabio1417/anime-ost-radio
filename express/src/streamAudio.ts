import ffmpegFluent from 'fluent-ffmpeg'
import fs from 'fs'
import process from 'process'
import { Readable } from 'stream'

ffmpegFluent.setFfmpegPath('/usr/bin/ffmpeg')

type ProgressDataI = {
    frames: number
    currentFps: number
    currentKbps: number
    targetSize: number
    timemark: string
}

const rtmp_url = process.env.RTMP_URL || 'rtmp://localhost:1935'
const rtmp_stream_url = `${rtmp_url}/stream/radio`

export async function streamToLive(stream: string | fs.ReadStream | Readable, rtmp: string = rtmp_stream_url) {
    const ffmpegStream = ffmpegFluent(stream)
        .inputOptions(['-re'])
        .noVideo()
        .audioBitrate(320)
        .audioChannels(2)
        .audioFrequency(44100)
        .audioCodec('aac')
        .format('flv')
        .on('progress', (data: ProgressDataI) => console.log('FFMPEG progress: ', data.timemark))
        .on('error', err => console.error(err))
        .on('end', () => console.log('FFMPEG finised encoding'))
        .saveToFile(rtmp)

    return ffmpegStream
}
