-   API

*   localhost:port/stream : Stream
*   localhost:port/api/song : [GET] Song List
*   localhost:port/api/song/[songId] : [GET] Song Item
*   localhost:port/api/song/[songId]/vote : [POST] Upvote Song Item /
*   localhost:port/api/queue : [GET] Queue List

-   ENVIRONMENT VARIABLES

*   PORT: [number] expres js port
*   DATABASE_URL: [string] mongodb url
*   AUTO_UPDATE_SONGS: [boolean] run data scrapper

-   SETUP

*   npm install
*   npm start or npm run dev
