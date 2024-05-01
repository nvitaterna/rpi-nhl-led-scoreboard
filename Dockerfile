FROM node:20-alpine

WORKDIR /app

COPY package.json ./package.json

COPY yarn.lock ./yarn.lock

RUN apk add --no-cache --virtual .gyp \
  python3 \
  make \
  g++

RUN yarn

RUN apk del .gyp

RUN mkdir -p ./data/db

RUN mkdir -p ./data/prefs

COPY assets ./assets

COPY ./src ./src

COPY tsconfig.json ./tsconfig.json

COPY tsconfig.build.json ./tsconfig.build.json

RUN yarn build

ENTRYPOINT ["node", "dist/main.js"]
