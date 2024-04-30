FROM arm32v6/node:20-bookworm

WORKDIR /app

COPY package.json ./package.json

COPY yarn.lock ./yarn.lock

RUN yarn

RUN mkdir ./data

COPY assets ./assets

COPY ./src ./src

COPY tsconfig.json ./tsconfig.json

COPY tsconfig.build.json ./tsconfig.build.json

RUN yarn build

ENTRYPOINT ["node dist/main.js"]
