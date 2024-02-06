# ANIME OST RADIO

#### URL

-   Local-Express : http://localhost:8081/
-   React : http://localhost/
-   Express API : http://localhost/api/

#### API

-   /api/stream : Stream
-   /api/scrape : Start Scraper

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

-   PORT: [number] expres js port
-   DATABASE_URL: [url] mongodb url
-   ORIGIN: [string] url separated by comma
-   JWT_SECRET: [string] jwt secret

-   BUCKET_NAME: [string] aws bucket name
-   BUCKET_ENDPOINT: [string] aws endpoint
-   BUCKET_REGION: [string] aws bucket region
-   BUCKET_ACCESS_KEY_ID: [string] aws KEY ID
-   BUCKET_SECRET_ACCESS_KEY: [string] aws secret ACCESS KEY

optional

-   auto_empty_tmp: [boolean] delete previous temporary played song files on download

#### RUN DEV

Setup s3 environment variable on docker-compose.yml or ./express/.env file

```
docker compose up --build
```

### RUN PROD (DOCKER)

```
#! todo
```
