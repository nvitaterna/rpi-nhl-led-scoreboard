FROM arm32v7/node:20-bookworm

COPY . /app

WORKDIR /app

RUN yarn

RUN yarn build

ENTRYPOINT ["node dist/main.js"]
