FROM node:20-alpine3.17 as base

WORKDIR /app
ENV node_env='production'

FROM base as frontend-build

COPY client ./
RUN npm install --include=dev && npm run build && rm -rf node_modules

FROM base as backend-build

COPY server ./
RUN npm install --include=dev && npm run build && npm prune --omit=dev

FROM node:20-alpine3.17

WORKDIR /app
ENV node_env='production'

COPY --from=backend-build /app /app
COPY --from=frontend-build /app/dist /app/dist/react


EXPOSE 3000
CMD [ "npm", "run", "start" ]