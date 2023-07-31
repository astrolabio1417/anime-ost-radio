import ffmpegFluent from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { randomUUID } from "crypto";
import { PassThrough } from "stream";
import Throttle from "throttle";
import fs from "fs";
import { USER_AGENT } from "./data/constant";
import { sleep } from "./helpers/sleep";
import SongModel, { ISong } from "./models/songModel";
import { checkObjectId } from "./helpers/checkObjectId";
import { FilterQuery, SortOrder } from "mongoose";
import { download } from "./downloader";

const QueueSort: {
    [key: string]: SortOrder | { $meta: any };
} = {
    "vote.total": -1,
    "vote.timestamp": "asc",
    _id: -1,
};
const getQueueOption = (id: string) =>
    ({
        ...(checkObjectId(id) ? { _id: { $ne: id } } : {}),
        $or: [{ played: false }, { "vote.total": { $gte: 1 } }],
    } as FilterQuery<ISong>);

class Queue {
    currentTrack: string;
    clients: Map<string, PassThrough>;
    index: number;
    isPlaying: boolean;
    stream: NodeJS.ReadableStream | fs.ReadStream | null;
    userAgent: string;
    throttle: Throttle | null;
    bitrate: number;

    constructor() {
        this.currentTrack = "";
        this.clients = new Map();
        this.index = 0;
        this.stream = null;
        this.throttle = null;
        this.isPlaying = false;
        this.bitrate = 128; // 320
        this.userAgent = USER_AGENT;
    }

    async getCurrentTrack() {
        if (!this.currentTrack) return;
        return await SongModel.findById(this.currentTrack).catch((e) =>
            console.error(e)
        );
    }

    getTracks() {
        return SongModel.find();
    }

    addClient() {
        const id = randomUUID();
        const client = new PassThrough();

        this.clients.set(id, client);
        return { id, client };
    }

    removeClient(id: string) {
        this.clients.delete(id);
    }

    broadcast(chunk: any) {
        this.clients.forEach((client) => {
            client.write(chunk);
        });
    }

    async queue(limit: number = 10) {
        return await SongModel.find(getQueueOption(this.currentTrack))
            .sort(QueueSort)
            .limit(limit);
    }

    async getNextTrack() {
        return await SongModel.findOne(getQueueOption(this.currentTrack)).sort(
            QueueSort
        );
    }

    async rotateTracks() {
        console.debug("[func]: Rotate Tracks");

        if (this.currentTrack) {
            console.debug("[func]: set current track to played");
            await SongModel.findByIdAndUpdate(this.currentTrack, {
                $set: { "vote.list": [], "vote.total": 0, played: true },
            });
        }

        console.debug("[func]: setting next track");
        const nextTrack = await this.getNextTrack();
        this.currentTrack = nextTrack?.id?.toString() ?? "";
        console.debug(
            `[func]: next track: ${nextTrack?.name} ${nextTrack?._id}`
        );

        if (!nextTrack) {
            console.debug("[func]: reset all song to played = false");
            // reset tracks
            await SongModel.updateMany(
                { played: false },
                { $set: { played: true } }
            );
        }

        this.startBroadcast();
    }

    play() {
        this.startBroadcast();
    }

    pause() {
        if (!this.throttle) return;
        this.isPlaying = false;
        this.throttle.removeAllListeners("end");
        this.throttle.removeAllListeners("error");
        this.throttle.end();
    }

    async startBroadcast() {
        const track = await this.getCurrentTrack();

        if (!track) {
            console.debug("[func]: waiting for tracks");
            await sleep(5000);
            await this.rotateTracks();
            return;
        }

        if (!track?.musicUrl) return await this.rotateTracks();
        const stream = await this.createTrackReadStream(track.musicUrl);
        if (!stream) return;
        this.stream = stream;
        const encodedStream = this.encodeReadStream(stream, this.bitrate);

        console.log(
            `Playing ${track.name} by ${track.artist} | bitrate: ${this.bitrate}`
        );
        this.isPlaying = true;

        // broadcast encoded track file
        this.throttle = new Throttle((this.bitrate * 1000) / 8);
        encodedStream
            .pipe(this.throttle)
            .on("data", (chunk) => this.broadcast(chunk))
            .on("end", () => this.rotateTracks())
            .on("error", () => this.rotateTracks());
    }

    encodeReadStream(stream: fs.ReadStream, bitrate: number = 320) {
        const ffmpegStream = ffmpegFluent(stream)
            .setFfmpegPath(ffmpegPath ?? "")
            .format("mp3")
            .noVideo()
            .audioBitrate(bitrate)
            .audioChannels(2)
            .audioFrequency(44100)
            .audioFilters([
                {
                    filter: "volume",
                    options: ["0.5"],
                },
                {
                    filter: "silencedetect",
                    options: { n: "-50dB", d: 5 },
                },
            ])
            .on("progress", (data) => {
                console.log("ffmpeg encoding Progress: ", data);
            })
            .on("error", (err) => {
                console.error(err);
            });

        return ffmpegStream;
    }

    async createTrackReadStream(path: string) {
        if (!/^(https|http):\/\//gi.test(path)) {
            if (!fs.existsSync(path)) return null;
            return fs.createReadStream(path);
        }

        let url: URL | null = null;

        try {
            url = new URL(path);
        } catch (e) {
            console.error(e);
        }

        if (!url) return null;
        return await download(path, encodeURIComponent(path));
    }
}

const queue = new Queue();

export { Queue, queue };
