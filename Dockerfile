FROM node:20-alpine3.17 as base

WORKDIR /app
ENV node_env='production'

# frontend build
FROM base as frontend-build

COPY client .
RUN npm ci --include=dev && npm run build && rm -rf node_modules

# backend build
FROM base as express-build

COPY server .

RUN npm CI --include=dev && npm run build && npm prune --omit=dev

# final
FROM node:20-alpine3.17

WORKDIR /app

ENV node_env='production'

RUN apk add --no-cache ffmpeg nginx nginx-mod-rtmp \
    && mkdir -p /tmp/hls

COPY --from=express-build /app /app
COPY --from=frontend-build /app/dist /app/dist/react
COPY ./nginx_conf /etc/nginx

EXPOSE 3000

CMD [ "npm", "run", "start" ]