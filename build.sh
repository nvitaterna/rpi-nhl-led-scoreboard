#!/bin/bash

IMAGE=nvitaterna/rpi-nhl-led-scoreboard

VERSION=0.0.2

docker buildx build --push \
   --platform linux/arm64/v8 \
   -t ${IMAGE}:latest -t ${IMAGE}:${VERSION} .
