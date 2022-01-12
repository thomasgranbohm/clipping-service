# `clipping-service`

> You know when you are looking for that very specific clip from a TV Show but it doesn't exist?

## Setup

1. Copy every `config/*.example.env` to `config/*.env`
1. Copy `example.env` to `.env`
1. Fill in the values
1. Run `./scripts/build.sh`

## Requirements

- `docker` and `docker-compose`
- OpenSSL
- Plex Media Server setup
- Plex Pass for webhooks

## What's left to do

- Backend error handling
- Better clip creating UI
- Change PRIVATE_KEY and PUBLIC_KEY from PEM format to JWK string format
- Enhanced video player
- Improved UI and UX
- Search features
- Transcoding or some solution for media that browsers don't support
