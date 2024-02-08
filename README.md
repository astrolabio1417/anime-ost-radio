# ANIME OST RADIO

Radio/Music App using NGINX RTMP (HLS STREAMING), EXPRESS, REACT and MONGO

## URL

-   React : http://localhost/
-   Express API : http://localhost/api/
-   Mongo-Express : http://localhost:8081/

## API

Stream

-   /api/stream : Stream
-   /api/scrape : Start Scraper

Queue

-   /api/queue : [GET] Queue List

Songs

-   /api/songs : [GET] Song List
-   /api/songs/[songId] : [GET] Song Item
-   /api/songs/[songId]/vote : [PUT] Upvote Song
-   /api/songs/[songId]/vote : [DELETE] Downvote Song

Playlists

-   /api/playlists : [GET] Playlist List
-   /api/playlists : [POST] Create Playlist
-   /api/playlists/[playlistId] : [GET] Playlist Item
-   /api/playlists/[playlistId] : [PUT] Update Playlist
-   /api/playlists/[playlistId]/songs/[songId] : [PUT] Add Song to Playlist
-   /api/playlists/[playlistId]/songs/[songId] : [DELETE] Remove Song to Playlist

Shows

-   /api/shows : [GET] Show List
-   /api/shows/[songId] : [GET] Show Item

Artists

-   /api/artists : [GET] Artist List
-   /api/artists/[songId] : [GET] Artist Item

## ENVIRONMENT VARIABLES

-   DATABASE_URL: [url] mongodb url
-   ORIGIN: [string] url separated by comma
-   JWT_SECRET: [string] jwt secret
-   BUCKET_NAME: [string] aws bucket name
-   BUCKET_ENDPOINT: [string] aws endpoint
-   BUCKET_REGION: [string] aws bucket region
-   BUCKET_ACCESS_KEY_ID: [string] aws KEY ID
-   BUCKET_SECRET_ACCESS_KEY: [string] aws secret ACCESS KEY
-   PORT: [number] 8000, express js port
-   AUTO_EMPTY_TMP: [boolean] false, delete previous temporary played song files on download
-   RTMP_URL: [url] rtmp://localhost:1935, Nginx RTMP Url

## DEV | DOCKER COMPOSE

Setup ENVIRONMENT VARIABLES on docker-compose.yml or ./express/.env file

```
# Run docker dev
docker compose up --build
```

## PROD | DOCKER

-   NGINX
-   SUPERVISORD
-   EXPRESS

BUILD ARGS

-   SCHEME: [https | http] https, port 80 http or 443 https
-   DOMAIN: [string] localhost

SETUP
Ex. domain localhost

Change production build environment variable

```
# Change the VITE_SERVER_URL on this file
# /client/.env.production
VITE_SERVER_URL=http://localhost
```

Build docker

```
docker build --build-arg SCHEME=http --build-arg DOMAIN=localhost --build-arg -t radio-app .
```

Run docker

```
docker run ORIGIN=http://localhost -e DATABASE_URL="mongodb+srv://url" -e JWT_SECRET=mysecret -e AUTO_EMPTY_TMP=true -p 80:80 radio-app
```
