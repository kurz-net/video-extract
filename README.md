# Video Extraction Tool

## Prerequisites
- ffmpeg
- node (>= v14)
- npm
- yarn

## Initial Setup
```bash
$ yarn # install dependencies
$ yarn db:gen # generate prisma client
```

Setup .env file, for example:
```
DATABASE_URL=file:./database.db
API_PORT=5000
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

## Overview
There are 3 components to this software:
- Web Application
- API
- Downloader

The web application is a NextJS app with a tPRC backend.

The API is only there to serve the downloaded mp4 video and clip files.

The Downloader downloads the youtube videos and cuts the clips from
those video files.

## Features
- [ ] 