# `clipping-service`

> You know when you are looking for that very specific clip from a TV Show but it doesn't exist?

## Setup

1. Run `make setup`
2. Fill in missing values in `.env` and `backend/.env`
	- [How to find your Plex token](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/)

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
