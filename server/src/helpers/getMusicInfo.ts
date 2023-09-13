import { ffprobe } from '@dropb/ffprobe'
import { path as ffprobePath } from 'ffprobe-static'
ffprobe.path = ffprobePath

export default async function getMusicInfo(filepath: string) {
    const fileMetadata = await ffprobe(filepath)
    console.log({ fileMetadata })
    if (!fileMetadata.format.duration) return
    const { bit_rate, duration } = fileMetadata.format
    return { bit_rate: parseInt(bit_rate) ?? 32000, duration }
}
