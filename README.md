# YouTube Downloader Web Interface

A simple web interface to download audio or video from Youtube for those who miss the old days — no ads, no tracking, no clutter.

The project’s goal is both to deliver a smooth user experience and to serve as a practical learning project

> Note: For now, this project works only in self-host mode. A proper deployment process is in progress. (I'm currently trying to handle YouTube’s quirks and restrictions 😅)

## Prerequisites (for local development only)

If you want to run the project locally without Docker, you need:

- **Node.js >= 18**
- **Python 3** (required for `yt-dlp`)
- [**yt-dlp**](https://github.com/yt-dlp/yt-dlp)

*yt-dlp is a feature-rich command-line audio/video downloader with support for thousands of sites. The project is a fork of based on the now inactive youtube-dlc.*

## Installation

Clone the repository
```
git clone https://github.com/Fano435/youtube-download-music.git
cd youtube-download-music
```

Backend
---
Option 1 - Using **Docker**:
```
cd backend
docker build -t yt-dl-web .
docker run -p 3000:3000 yt-dl-web
```

Option 2 - Local **Node.js** version:
```
cd backend
pnpm install
pnpm dev
```

Frontend
---
Open another terminal and start the frontend:
```
cd frontend
pnpm install
pnpm dev
```

The frontend is accessible at the address displayed by Vite (default http://localhost:5173)

