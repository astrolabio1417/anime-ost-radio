import fs from 'fs'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { sleep } from './helpers/sleep'
import { USER_AGENT } from './data/constant'
import { escapeFilename } from './helpers/escapeFilename'

type IRange = [number, number | undefined]
export const tmpPath = `${process.cwd()}/tmp`

if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath)
}

async function rangeDownloader(output: string, url: string, range: IRange): Promise<null | string> {
    const tmpOutput = `${output}.tmp`

    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput)
    if (fs.existsSync(output)) return output

    const writer = fs.createWriteStream(tmpOutput, { flags: 'wx' })
    const data = await fetch(url, {
        headers: { referer: url, Range: `bytes=${range[0]}-${range[1] ?? ''}`, 'User-Agent': USER_AGENT },
    }).catch(e => {
        console.error('[code-1] Range Downloader fetch error: ', e)
        fs.unlinkSync(tmpOutput)
        return
    })
    if (!data?.body) return null
    return await finished(Readable.fromWeb(data.body as any).pipe(writer))
        .then(() => {
            fs.renameSync(tmpOutput, output)
            return output
        })
        .catch(e => {
            console.error('[code-2] Range Downloader pipe error: ', e)
            fs.unlinkSync(tmpOutput)
            return 'error' as const
        })
}

async function getContentLength(url: string) {
    const head = await fetch(url, {
        method: 'HEAD',
    })
    const contentLength = head.headers.get('content-length')
    console.log({ contentLength })
    if (!contentLength) return
    return parseInt(contentLength)
}

export async function download(url: string, filename: string, errors: number = 0, totalChunks = 10, maxError = 3) {
    filename = escapeFilename(filename)
    const outputFile = `${tmpPath}/${filename}`

    if (fs.existsSync(outputFile)) return fs.createReadStream(outputFile).on('close', () => fs.unlinkSync(outputFile))

    console.log(`${url} downloading...`)
    const contentLength = await getContentLength(url).catch(e => console.error('Cannot get the content length!', e))

    if (!contentLength) {
        if (errors >= maxError) return
        console.log(`Download Retry: ${errors + 1}/${maxError}`)
        await sleep(3000)
        const dl = (await download(url, filename, errors + 1)) as fs.ReadStream | undefined
        return dl
    }

    const chunkSize = Math.floor(contentLength / totalChunks)
    const chunkRanges: IRange[] = []

    // create ranges
    Array.from(Array(totalChunks)).map((_, index) => {
        const prevChunk = chunkRanges[index - 1]?.[1] ?? 0
        const isLastIndex = index + 1 === totalChunks
        chunkRanges.push([prevChunk + (index ? 1 : 0), isLastIndex ? undefined : prevChunk + chunkSize])
    })

    console.log({ chunkRanges })

    const promises = await Promise.all(
        chunkRanges.map((chunks, index) => {
            const chunkFilename = `${process.cwd()}/tmp/${filename}-${index}`
            return rangeDownloader(chunkFilename, url, chunks)
        }),
    )

    const isAllChunkDownloaded = !promises.includes(null)
    console.log({ isAllChunkDownloaded, promises })

    if (!isAllChunkDownloaded) {
        if (errors >= maxError) return
        console.log(`Download Retry: ${errors + 1}/${maxError}`)
        await sleep(3000)
        const dl = (await download(url, filename, errors + 1)) as fs.ReadStream | undefined
        return dl
    }

    const mergeWriter = fs.createWriteStream(outputFile)
    const streams = promises.map(fname => fs.createReadStream(fname as string))
    await merger(streams, mergeWriter)
    promises.forEach(fname => fs.unlinkSync(fname as string))
    console.log(`${outputFile} download finished...`)
    return fs.createReadStream(outputFile).on('close', () => fs.unlinkSync(outputFile))
}

async function merger(streams: fs.ReadStream[], writeStream: fs.WriteStream) {
    for (const s of streams) {
        console.log('merging...')
        await new Promise<boolean>((resolve, reject) => {
            s.on('data', chunk => writeStream.write(chunk))
                .on('error', () => reject('error on merge'))
                .on('close', () => resolve(true))
        })
    }
}
