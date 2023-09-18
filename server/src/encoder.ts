import ffmpegFluent from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import fs from 'fs'
import { Readable } from 'stream'

export default function encodeReadStream(stream: fs.ReadStream | Readable, bitrate: number = 320) {
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
        .on('progress', data => console.log('ffmpeg encoding Progress: ', data))
        .on('error', err => console.error(err))
        .on('end', () => console.log('finised encoding'))

    return ffmpegStream
}
