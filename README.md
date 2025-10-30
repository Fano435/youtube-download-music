# YouTube converter → MP3

A simple web interface to download music (or videos) from Youtube for those who miss the old days — no ads, no tracking, no clutter.

The project’s goal is both to deliver a smooth user experience and to serve as a practical learning project

Note : As long as [yt-dlp](https://github.com/yt-dlp/yt-dlp) remains maintained, the site will stay reliable and stable.

## Installation
### Prerequisites

- **Node.js >= 18**
- **Python 3** (required for `yt-dlp`)
- **yt-dlp**

*yt-dlp is a feature-rich command-line audio/video downloader with support for thousands of sites. The project is a fork of [youtube-dl](https://github.com/ytdl-org/youtube-dl) based on the now inactive youtube-dlc.*

### Development

Clone the repository
```
git clone https://github.com/Fano435/youtube-download-music.git
cd youtube-download-music
```

Then install the frontend and backend dependencies :

```
cd backend
pnpm install
pnpm dev
```

Open another shell :
```
cd frontend
pnpm install
pnpm dev
```

The frontend is accessible at the address displayed by Vite (default http://localhost:5173).

