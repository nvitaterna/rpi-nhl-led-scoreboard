FROM arm32v7/node:20-bookworm

WORKDIR /app

COPY package.json ./package.json

COPY yarn.lock ./yarn.lock

RUN yarn

RUN mkdir ./data

COPY ./src ./src

RUN yarn build

ENTRYPOINT ["node dist/main.js"]
