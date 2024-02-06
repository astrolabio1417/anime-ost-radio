import { z } from "zod";

const createPlaylistSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "Playlist Title is required" }).min(1).max(50, { message: "Playlist Title not more than 50 length" }),
        cover: z.string().url().optional(),
        thumbnail: z.string().url().optional()
    })
})

export default createPlaylistSchema