# Video Extraction Tool

## Prerequisites

- [ffmpeg](https://ffmpeg.org/)
- node v16.17.0
- yarn v3.2.3
- npm >= 8.15

## Setup

### Create .env

```
DATABASE_URL=file:./database.db
API_PORT=5000
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

```bash
$ yarn # install dependencies
$ yarn db:gen # generate prisma client
$ yarn db:seed # optional: seed database
$ yarn dev # run all components in parallel
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

### Bigger Features

- [ ] S3 Buckets for video storage
- [ ] Queue System for downloading videos and clips (f.e. redis and bull)
- [ ] Advanced Video Management (folders, tags, title search)
- [ ] Download youtube videos in browser (with cors.sh / cors-anywhere proxy and ytdl-browser)
- [ ] Download all videos in playlist

### Smaller Features

- [ ] Save thumbnails and show as video poster
- [ ] Failed youtube clip download management
- [ ] Clip modal, instead of opening mp4 in new tab
- [ ] UI / UX Improvements (modals for alerts and prompts)
- [ ] Bulk Import (text field with comma or line separated urls)
