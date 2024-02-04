import ffmpegFluent from 'fluent-ffmpeg'
import fs from 'fs'
import { Readable } from 'stream'

ffmpegFluent.setFfmpegPath('/usr/bin/ffmpeg')

type ProgressDataI = {
    frames: number
    currentFps: number
    currentKbps: number
    targetSize: number
    timemark: string
}

export default function encodeReadStream(stream: fs.ReadStream | Readable, bitrate: number = 320) {
    const ffmpegStream = ffmpegFluent(stream)
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
        .on('progress', (data: ProgressDataI) => console.log('FFMPEG progress: ', data.timemark))
        .on('error', err => console.error(err))
        .on('end', () => console.log('FFMPEG finised encoding'))

    return ffmpegStream
}

export async function streamToLive(stream: string | fs.ReadStream | Readable, rtmp: string = 'rtmp://nginx:1935/stream/test') {
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

export async function streamMultiToLive(streams1: (string | fs.ReadStream | Readable)[], rtmp: string = 'rtmp://nginx:1935/stream/test') {
    const ffmpegStream = ffmpegFluent()
    const streams = ["/app/tmp/Akeboshi.mp3", "/app/tmp/Aisuru Koto.mp3"]

    streams.forEach(stream => ffmpegStream.input(stream))

    ffmpegStream.inputOptions(['-re'])
        .noVideo()
        .audioBitrate(320)
        .audioChannels(2)
        .audioFrequency(44100)
        .audioCodec('aac')
        .complexFilter([{ filter: 'amix', options: { inputs: streams.length, duration: 'first' } }])
        .format('flv')
        .on('progress', (data: ProgressDataI) => console.log('FFMPEG progress: ', data.timemark))
        .on('error', err => console.error(err))
        .on('end', () => console.log('FFMPEG finised encoding'))
        .saveToFile(rtmp)

    return ffmpegStream
}

export function playRandomSong() {
    const ffmpegStream = ffmpegFluent('/app/x1.mp4')
        .inputOptions(['-re'])
        .outputOptions([
            '-c copy',
            '-f flv',
        ])
        .on('progress', (data: ProgressDataI) => console.log('FFMPEG progress: ', data.timemark))
        .on('error', err => console.error(err))
        .on('end', () => console.log('FFMPEG finised encoding'))
        .saveToFile('rtmp://nginx:1935/stream/test')

    return ffmpegStream
}
