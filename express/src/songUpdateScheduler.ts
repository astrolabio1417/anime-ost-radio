import schedule from 'node-schedule'
import { getAllanimeSong } from './services/allanimeSongs'
import SongModel, { ISong } from './models/songModel'
import { sleep } from './helpers/sleep'

let isJobRunning = false
const SLEEP_TIME = 5000

export async function getAllanimeSongJobFunc(page = 1) {
    isJobRunning = true
    console.log('[schedule]: Start at page: ', page)

    try {
        const data = await getAllanimeSong(page)
        const songs = data?.data?.musics?.edges

        if (!songs?.length) {
            await sleep(SLEEP_TIME)
            getAllanimeSongJobFunc(page)
            console.log('[schedule]: No data | End at page: ', page)
            return
        }

        const newSongPromises = songs
            .filter(a => {
                return a.musicUrls?.[0]?.url
            })
            .map(song =>
                SongModel.create({
                    artist: song?.artist?.name?.full,
                    duration: song?.duration,
                    musicUrl: song?.musicUrls?.[0]?.url,
                    name: song?.musicTitle?.full,
                    show: song?.show?.name,
                    image: { cover: song?.cover, thumbnail: song?.show?.thumbnail },
                } as ISong).catch(() => null),
            )

        const newSongs = await Promise.all(newSongPromises)
        const added = newSongs.filter(song => song !== null)
        const rejected = newSongs.filter(song => song === null)
        console.log(`[schedule]: song scraper insertion Added: ${added.length} | Total Rejected: ${rejected.length}`)

        if (!added.length) {
            isJobRunning = false
            console.log('[schedule]: No Added Data | End at page: ', page)
            return
        }

        // crawl next page
        await sleep(SLEEP_TIME)
        await getAllanimeSongJobFunc(page + 1)
    } catch (e) {
        console.error('[schedule] song scraper job error ', e)
        console.log('[schedule]: End at page: ', page)
        isJobRunning = false
    }
}

export function runAllanimeSongJob() {
    console.log(`[schedule]: song scraper job init`)

    // const everyMinute = "*/1 * * * *";
    const time = '*/59 * * * *'

    // getAllanimeSongJobFunc(1)

    const allanimeSongJob = schedule.scheduleJob(time, async function () {
        if (isJobRunning) return console.log('[schedule]: Job is still RUNNING...')
        console.log(`[schedule]: Job is running...`)
        await getAllanimeSongJobFunc(1)
        console.log('[schedule]: Job Ended')
    })
    return allanimeSongJob
}
