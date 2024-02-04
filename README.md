# ANIME OST RADIO

#### API

-   /api/stream : Stream

-   /api/queue : [GET] Queue List

-   /api/songs : [GET] Song List
-   /api/songs/[songId] : [GET] Song Item
-   /api/songs/[songId]/vote : [PUT] Upvote Song
-   /api/songs/[songId]/vote : [DELETE] Downvote Song

-   /api/playlists : [GET] Playlist List
-   /api/playlists : [POST] Create Playlist
-   /api/playlists/[playlistId] : [GET] Playlist Item
-   /api/playlists/[playlistId] : [PUT] Update Playlist
-   /api/playlists/[playlistId]/songs/[songId] : [PUT] Add Song to Playlist
-   /api/playlists/[playlistId]/songs/[songId] : [DELETE] Remove Song to Playlist

-   /api/shows : [GET] Show List
-   /api/shows/[songId] : [GET] Show Item

-   /api/artists : [GET] Artist List
-   /api/artists/[songId] : [GET] Artist Item

#### ENVIRONMENT VARIABLES

-   PORT: expres js port
-   DATABASE_URL: mongodb url
-   ORIGIN: url separated by comma
-   JWT_SECRET: jwt secret

-   BUCKET_NAME: aws bucket name
-   BUCKET_ENDPOINT: aws endpoint
-   BUCKET_REGION: aws bucket region
-   BUCKET_ACCESS_KEY_ID: aws KEY ID
-   BUCKET_SECRET_ACCESS_KEY: aws secret ACCESS KEY

#### RUN DEV

```
 npm install
 npm run dev
```
