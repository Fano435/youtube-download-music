// src/routes/convert.ts
import { Router } from "express";
import ytdl from "ytdl-core";
import { spawn } from "child_process";

const router = Router();

router.get("/", async (req, res) => {
    const videoUrl = req.query.url as string;
    console.log("URL reçue :", videoUrl)

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).send("Missing YouTube URL");
    }

    // const info = await ytdl.getInfo(videoUrl);
    // const title = info.videoDetails.title
    // res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
    res.header("Content-Disposition", 'attachment; filename="audio.mp3"');
    res.header("Content-Type", "audio/mpeg");

    const ytdlp = spawn("yt-dlp", [
    "-f", "bestaudio",
    "-x", "--audio-format", "mp3",
    "-o", "-", // output to stdout
    videoUrl
    ])

    ytdlp.stdout.pipe(res)

    ytdlp.stderr.on("data", data => {
    console.error("yt-dlp:", data.toString()); })
  
    ytdlp.on("error", err => {
    console.error("Erreur yt-dlp:", err);
    if (!res.headersSent)
      res.status(500).json({ error: "Erreur lors de la conversion" });
  });
    // let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    // console.log(audioFormats[0])

    // ffmpeg(ytdl(videoUrl, { filter: "audioonly" }))
    // .audioBitrate(192)
    // .format("mp3")
    // .on("error", err => {
    //     console.error(err);
    //     if (!res.headersSent)
    //       res.status(500).json({ error: "Erreur pendant la conversion audio" });
    //   })
    // .pipe(res);

});

export default router;
