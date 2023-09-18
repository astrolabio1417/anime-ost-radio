import fs from 'fs'
import { Stream } from 'stream'
import { USER_AGENT } from './data/constant'
import { escapeFilename } from './helpers/escapeFilename'
import fetch from 'node-fetch'
import { promisify } from 'util'

type IRange = [number, number | undefined]
export const tmpPath = `${process.cwd()}/tmp`

if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath)
}

async function downloadRange(output: string, url: string, range: IRange): Promise<null | string> {
    const tmpOutput = `${output}.tmp`

    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput)
    if (fs.existsSync(output)) return output

    const headers = { referer: url, Range: `bytes=${range[0]}-${range[1] ?? ''}`, 'User-Agent': USER_AGENT }

    try {
        const response = await fetch(url, { headers })
        const writer = fs.createWriteStream(tmpOutput, { flags: 'wx' })
        await promisify(Stream.pipeline)(response.body, writer)
        if (!response?.body) return null
        fs.renameSync(tmpOutput, output)
        return output
    } catch (e) {
        console.error('Range Downloader error: ', e)
        fs.existsSync(tmpOutput) && fs.unlinkSync(tmpOutput)
        return null
    }
}

async function getContentLength(url: string) {
    const head = await fetch(url, { method: 'HEAD' })
    const contentLength = head.headers.get('content-length')
    return contentLength ? parseInt(contentLength) : null
}

export async function download(
    url: string,
    filename: string,
    errors: number = 0,
    totalChunks = 10,
    maxError = 3,
): Promise<undefined | fs.ReadStream> {
    filename = escapeFilename(filename)
    const outputFile = `${tmpPath}/${filename}`

    if (fs.existsSync(outputFile)) {
        return fs.createReadStream(outputFile).on('close', () => fs.existsSync(outputFile) && fs.unlinkSync(outputFile))
    }

    console.log(`${url} downloading...`)
    const contentLength = await getContentLength(url).catch(e => console.error('Cannot get the content length!', e))

    if (!contentLength) {
        if (errors >= maxError) return
        console.log(`Download Retry: ${errors + 1}/${maxError}`)
        return await download(url, filename, errors + 1)
    }

    const chunkSize = Math.floor(contentLength / totalChunks)
    const chunkRanges: IRange[] = []

    // create ranges
    Array.from(Array(totalChunks)).map((_, index) => {
        const prevChunk = chunkRanges[index - 1]?.[1] ?? 0
        const isLastIndex = index + 1 === totalChunks
        chunkRanges.push([prevChunk + (index ? 1 : 0), isLastIndex ? undefined : prevChunk + chunkSize])
    })

    console.log('downloading chunks...')
    const chunks = await Promise.all(
        chunkRanges.map((chunks, index) => {
            const chunkFilename = `${tmpPath}/${filename}-${index}`
            return downloadRange(chunkFilename, url, chunks)
        }),
    )
    console.log('download chunks finished...')
    const isAllChunkDownloaded = !chunks.includes(null)
    console.log({ isAllChunkDownloaded, chunks })

    if (!isAllChunkDownloaded) return await download(url, filename, errors)

    const mergeWriter = fs.createWriteStream(outputFile)
    const streams = chunks.map(fname => fs.createReadStream(fname as string))
    await merger(streams, mergeWriter)
    chunks.forEach(fname => fname && fs.existsSync(fname) && fs.unlinkSync(fname))
    console.log(`${outputFile} download finished...`)
    return fs.createReadStream(outputFile).on('close', () => fs.unlinkSync(outputFile))
}

async function merger(streams: fs.ReadStream[], writeStream: fs.WriteStream) {
    console.log('merging...')
    for (const s of streams) {
        await new Promise<boolean>((resolve, reject) => {
            s.on('data', chunk => writeStream.write(chunk))
                .on('error', () => reject('error on merge'))
                .on('close', () => resolve(true))
        })
    }
}
