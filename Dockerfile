FROM node:20-alpine3.17 as base

WORKDIR /app

ENV node_env='production'

# frontend build
FROM base as frontend-build

COPY client .

RUN npm config set registry http://registry.npmjs.org/ \
    && npm ci --include=dev && npm run build

FROM base as express-build

COPY express .

RUN npm ci --include=dev && npm run build && npm prune --production

FROM base as final

RUN apk add --no-cache ffmpeg nginx nginx-mod-rtmp supervisor \
    && mkdir -p /tmp/hls \
    && npm config set registry http://registry.npmjs.org/

COPY --from=express-build /app /app
COPY --from=frontend-build /app/dist /app/react
COPY ./nginx_conf /etc/nginx
COPY ./supervisord.conf /etc/supervisord.conf

# DOCKER BUILD ARG
ARG SCHEME=http
ARG DOMAIN=localhost

# NGINX PATH AND FILES
ARG CONF_PATH=/etc/nginx/conf.d
ARG SSL_CONF_FILE=ssl.com.conf
ARG NO_SSL_CONF_FILE=no-ssl.com.conf

RUN apk add --no-cache nginx nginx-mod-rtmp ffmpeg

# disable nginx default config
RUN mv ${CONF_PATH}/localhost.conf ${CONF_PATH}/.localhost.conf \
    # set nginx server name
    && if [ "$SCHEME" = "https" ]; then \
    sed -i s/example.com/${DOMAIN}/g ${CONF_PATH}/.${SSL_CONF_FILE}; \
    else \
    sed -i s/example.com/${DOMAIN}/g ${CONF_PATH}/.${NO_SSL_CONF_FILE}; \
    fi \
    && sed -i s/example.com/${DOMAIN}/g ${CONF_PATH}/.prod.conf \
    # Enable nginx config
    && if [ "$SCHEME" = "https" ]; then \
    cp ${CONF_PATH}/.${SSL_CONF_FILE} ${CONF_PATH}/${DOMAIN}.conf; \
    else \
    cp ${CONF_PATH}/.${NO_SSL_CONF_FILE} ${CONF_PATH}/${DOMAIN}.conf; \
    fi \
    # create HLS directory
    && mkdir -p /tmp/hls

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
