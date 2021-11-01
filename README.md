# `clipping-service`

> You know when you are looking for that very specific clip from a TV Show but it doesn't exist?

## Setup

1. Copy every `*.example.env` to `*.env`
2. Fill in the values
3. Start!

## Requirements

- `docker` and `docker-compose`
- OpenSSL
- Plex Media Server setup

## What's left to do

- Better clip creating UI
- Enhanced video player
- Search features
- Transcoding or some solution for media that browsers don't support
- Change PRIVATE_KEY and PUBLIC_KEY from PEM format to JWK string format
- Pagination and intersection observers for episodes, seasons, shows, and libraries
- Improved UI and UX
- Database revalidation with the Plex Media Server data after load
- Backend error handling
