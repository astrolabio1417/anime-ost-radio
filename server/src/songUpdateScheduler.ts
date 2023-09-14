import schedule from 'node-schedule'
import { getAllanimeSong } from './services/allanimeSongs'
import SongModel from './models/songModel'
import { sleep } from './helpers/sleep'

let isJobRunning = false

export async function getAllanimeSongJobFunc(page = 1) {
    isJobRunning = true
    console.log(`[schedule]: song scraper job running... page: ${page}`)

    try {
        const data = await getAllanimeSong(page)
        const songs = data?.data?.musics?.edges

        if (!songs?.length) {
            console.log(data)
            await sleep(2000)
            getAllanimeSongJobFunc(page)
            return
        }

        const downloadableSongs = songs
            .filter(song => song?.musicUrls?.[0].downloadState === 'Finished')
            .map(song => ({
                sourceId: song._id,
                artist: song?.artist?.name?.full,
                duration: song?.duration,
                musicUrl: song?.musicUrls?.[0]?.url,
                name: song?.musicTitle?.full,
                show: song?.show?.name,
                image: {
                    cover: song?.cover,
                    thumbnail: song?.show?.thumbnail,
                },
            }))

        const newSongPromises = downloadableSongs.map(song =>
            SongModel.create({
                ...song,
                vote: {
                    list: [],
                    total: 0,
                },
                played: false,
                timestamp: Date.now(),
            }).catch(e => {
                console.error(e)
                return null
            }),
        )

        const newSongs = await Promise.all(newSongPromises)
        const added = newSongs.filter(song => song !== null)
        const rejected = newSongs.filter(song => song === null)
        console.log(`[schedule]: song scraper insertion Added: ${added.length} | Total Rejected: ${rejected.length}`)

        if (!added.length) {
            isJobRunning = false
            return
        }

        // crawl next page
        await sleep(2000)
        await getAllanimeSongJobFunc(page + 1)
    } catch (e) {
        console.error(`[schedule] song scraper job error ${e}`)
        isJobRunning = false
    }
}

export function runAllanimeSongJob() {
    console.log(`[schedule]: song scraper job init`)

    // const everyMinute = "*/1 * * * *";
    const time = '*/59 * * * *'

    // getAllanimeSongJobFunc(1)

    const allanimeSongJob = schedule.scheduleJob(time, async function () {
        if (isJobRunning) {
            return console.log('[schedule]: Job is still RUNNING...')
        }
        await getAllanimeSongJobFunc(1)
        console.log(`[schedule]: song insertation ENDED`)
    })
    return allanimeSongJob
}
