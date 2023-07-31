import fs from 'fs'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import Throttle from 'throttle'
import { sleep } from './helpers/sleep'

type IRange = [number, number]

async function rangeDownloader(
    output: string,
    url: string,
    range: IRange,
): Promise<'error' | 'ok'> {
    if (fs.existsSync(output)) return 'ok'
    const writer = fs.createWriteStream(output, { flags: 'wx' })
    const data = await fetch(url, {
        headers: {
            referer: url,
            Range: `bytes=${range[0]}-${range[1] ?? ''}`,
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        },
    }).catch(e => {
        console.error('[code 1] Range download error: ', e)
        fs.unlinkSync(output)
        return
    })
    if (!data?.body) return 'error'
    const result = await finished(
        Readable.fromWeb(data.body as any).pipe(writer),
    )
        .then(() => 'ok' as const)
        .catch(e => {
            console.error('[code 2] Range download error: ', e)
            fs.unlinkSync(output)
            return 'error' as const
        })
    return result
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

async function download(url: string, filename: string, errors: number = 0) {
    const outputFile = `${process.cwd()}/tmp/${filename}.mp3`
    console.log(`${url} downloading...`)
    const maxError = 3

    const contentLength = await getContentLength(url).catch(e => {
        console.error('Cannot get the content length!', e)
    })

    if (!contentLength) {
        if (errors >= maxError) return
        await sleep(3000)
        console.log('download retry ', errors)
        const dl = (await download(url, filename, errors + 1)) as
            | fs.ReadStream
            | undefined
        return dl
    }

    const totalChunks = 15
    const chunkSize = Math.floor(contentLength / totalChunks)
    const chunkRanges: IRange[] = []
    const filenames: string[] = []

    // create ranges
    Array.from(Array(totalChunks)).map((_, index) => {
        const prevChunk = chunkRanges[index - 1]
        const isLastIndex = index + 1 === totalChunks
        chunkRanges.push([
            (prevChunk?.[1] ?? 0) + (index ? 1 : 0),
            isLastIndex ? contentLength : (prevChunk?.[1] ?? 0) + chunkSize,
        ])
    })

    console.log(chunkRanges)

    const promises = await Promise.all(
        chunkRanges.map((chunks, index) => {
            const fname = `${process.cwd()}/tmp/${filename}-${index}.mp3`
            filenames.push(fname)
            try {
                return rangeDownloader(fname, url, chunks)
            } catch (e) {
                console.error(e)
            }
        }),
    ).catch(e => {
        console.error(e)
        return ['error']
    })

    const isAllChunkDownloaded = !promises.includes('error')
    console.log({ isAllChunkDownloaded, promises })
    if (!isAllChunkDownloaded) {
        if (errors >= maxError) return
        await sleep(3000)
        console.log('download retry ', errors)
        const dl = (await download(url, filename, errors + 1)) as
            | fs.ReadStream
            | undefined
        return dl
    }

    const mergeWriter = fs.createWriteStream(outputFile)
    const streams = filenames.map(fname => fs.createReadStream(fname))
    await merger(streams, mergeWriter)
    filenames.forEach(fname => fs.unlinkSync(fname))
    console.log(`${outputFile} download finished...`)
    return fs
        .createReadStream(outputFile)
        .on('close', () => fs.unlinkSync(outputFile))
}

async function merger(streams: fs.ReadStream[], writeStream: fs.WriteStream) {
    const stream = streams.shift()
    if (!stream) return
    await new Promise<void>(resolve => {
        stream
            .pipe(new Throttle(20000000))
            .on('data', chunk => writeStream.write(chunk))
            .on('error', () => resolve())
            .on('close', () => resolve())
    })
    await merger(streams, writeStream)
}

export { download }
