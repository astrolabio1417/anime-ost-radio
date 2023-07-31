import express, { Express } from "express";
import schedule from "node-schedule";
import dotenv from "dotenv";
import http from "http";
import { Server as IOServer } from "socket.io";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import SongModel from "./src/models/songModel";
import { queue } from "./src/queue";
import { checkObjectId } from "./src/helpers/checkObjectId";
import {
    getAllanimeSongJobFunc,
    runAllanimeSongJob,
} from "./src/songUpdateScheduler";

process.on("SIGINT", function () {
    schedule.gracefulShutdown().then(() => process.exit(0));
});

dotenv.config();
const mongoString: string | undefined = process.env.DATABASE_URL ?? "";
const port = process.env.PORT;
const app: Express = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new IOServer(server);
const updateSongList = process.env.AUTO_UPDATE_SONGS === "true";

(async () => {
    console.info("Connecting to Database...");
    await mongoose.connect(mongoString);
    const database = mongoose.connection;
    console.info("Database Connected");
    getAllanimeSongJobFunc();

    // RUN RADIO
    queue.play();

    database.on("error", (error) => {
        console.log(error);
    });

    database.once("connected", () => {
        console.log("Database Connected");
    });

    io.on("connection", (socket) => {
        console.log("New listener Connected");
    });

    app.get("/stream", (req, res) => {
        const { id, client } = queue.addClient();
        console.log(
            `[server]: ${id} has been added! Total Client: ${queue.clients.size}`
        );

        res.set({
            "Content-Type": "audio/mp3",
            "Transfer-Encoding": "chunked",
        });

        client.pipe(res);

        req.on("close", () => {
            queue.removeClient(id);
            console.log(`[server]: ${id} has been removed!`);
        });
    });

    app.get("/", (req, res) => {
        const uid = randomUUID();
        console.log({ uid });
        res.send("Express");
    });

    app.get("/api/song", async (req, res) => {
        const list = await SongModel.find();
        res.json({ list, total: list.length });
    });

    app.get("/api/queue", async (req, res) => {
        const list = (await queue.queue()) ?? [];
        res.json({
            list,
            total: list.length,
        });
    });

    app.get("/api/song/:id", async (req, res) => {
        const song = await SongModel.findOne({ _id: req.params.id });
        if (!song) return res.status(400).json({ message: "Not Found!" });
        return res.json(song);
    });

    app.post("/api/song/:id/vote", async (req, res) => {
        const vote = !!req.body?.vote;
        const session = req.body?.session ?? "user";

        if (!session) {
            return res.status(400).json({
                message: "Session is missing!",
            });
        }

        if (!checkObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid ID",
            });
        }

        const song = await SongModel.findOne({ _id: req.params.id });
        const firstVote = [0, null].includes(song?.vote.total ?? -1) && vote;

        const query = {
            _id: req.params.id,
            "vote.list": { [vote ? "$ne" : "$eq"]: session },
        };
        const data = {
            ...(firstVote ? { "vote.timestamp": Date.now() } : {}),
            [vote ? "$push" : "$pull"]: { "vote.list": session },
            $inc: { "vote.total": vote ? 1 : -1 },
        };

        const songUpdate = await SongModel.updateOne(query, data);

        songUpdate.modifiedCount
            ? res.status(201).json()
            : res.status(400).json({ message: songUpdate });
    });

    server.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);

        //
        // JOBS
        //
        updateSongList && runAllanimeSongJob();
    });
})();
