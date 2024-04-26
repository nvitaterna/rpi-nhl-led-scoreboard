FROM arm64v8/node:20-bookworm

COPY . /app

ENTRYPOINT ["/app/start-docker.sh"]