FROM arm32v7/node:20-bookworm

COPY . /app

ENTRYPOINT ["/app/start-docker.sh"]
