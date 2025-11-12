FROM node:20-alpine

RUN apk add --no-cache python3 ffmpeg yt-dlp

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
