import schedule from "node-schedule";
import { getAllanimeSong } from "./services/allanimeSongs";
import SongModel from "./models/songModel";
import { sleep } from "./helpers/sleep";

let isJobRunning = false;

export async function getAllanimeSongJobFunc(page = 1) {
    console.log(`[schedule]: Song insertation is running... page: ${page}`);

    isJobRunning = true;
    const data = await getAllanimeSong(page).catch((e) => {
        console.error(`[schedule]: allanime job error: ${e}`);
    });

    if (data?.errors) {
        const errors = data?.errors?.map((e) => e?.message);
        console.log(`[schedule]: Song insetation error: `, errors.join(", "));
        if (!errors.includes("PersistedQueryNotFound")) {
            isJobRunning = false;
            return;
        }
        console.log(`[schedule]: Song insertation retry`);
        await sleep(5000);
        await getAllanimeSongJobFunc(page);
        isJobRunning = false;
        return;
    }

    const songs = data?.data?.musics?.edges;

    if (!songs?.length) {
        isJobRunning = false;
        return;
    }

    const downloadableSongs = songs
        ?.filter((song) => song?.musicUrls?.[0]?.downloadState === "Finished")
        .map((song) => ({
            sourceId: song._id,
            artist: song?.artist?.name?.full,
            duration: song?.duration,
            musicUrl: song?.musicUrls?.[0]?.url,
            name: song?.musicTitle?.full,
            show: {
                name: song?.show?.name,
                id: song?.show?.showId,
            },
            image: {
                cover: song?.cover,
                thumbnail: song?.show?.thumbnail,
            },
        }));

    try {
        const newSongpromises = await Promise.allSettled(
            downloadableSongs.map((song) =>
                SongModel.create({
                    ...song,
                    vote: {
                        list: [],
                        total: 0,
                    },
                    played: false,
                })
            )
        );

        const added = [];
        const rejected = [];

        newSongpromises.map((a, index) => {
            const song = downloadableSongs[index];
            if (a.status === "rejected") return rejected.push(song);
            return added.push(a.value);
        });
        console.log(
            `[schedule]: Song insertation Total Added: ${added.length} | Total Rejected: ${rejected.length}`
        );

        if (!added.length) return (isJobRunning = false);

        // crawl the next page!
        await sleep(2000);
        await getAllanimeSongJobFunc(page + 1);
    } catch (e) {
        console.error(`[schedule]: Song insertation error: ${e}`);
    }
}

export function runAllanimeSongJob() {
    console.log(`[schedule]: song insertation init`);

    // const everyMinute = "*/1 * * * *";
    const time = "*/59 * * * *";

    const allanimeSongJob = schedule.scheduleJob(time, async function () {
        if (isJobRunning) {
            return console.log("[schedule]: Job is still RUNNING...");
        }
        await getAllanimeSongJobFunc(1);
        console.log(`[schedule]: song insertation ENDED`);
    });
    return allanimeSongJob;
}
