import { Router } from "express";
import ytdl from "ytdl-core";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/", async (req, res) => {
    const videoUrl = req.query.url as string;
    console.log("URL reçue :", videoUrl)

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).send("Missing or unvalid YouTube URL");
    }
    
    const outputFile = path.join("/tmp", `audio_${Date.now()}.mp3`)

    // Lancement du child process yt-dlp
    const ytdlp = spawn("yt-dlp", [
    "-f", "bestaudio",
    "-x", "--audio-format", "mp3",
    "-o", outputFile,
    videoUrl
    ])

     // On log les erreurs de yt-dlp
    ytdlp.stderr.on("data", data => { console.error("yt-dlp:", data.toString()); })

    // Quand yt-dlp se termine
    ytdlp.on("close", code => {
    if (code === 0) {
        // conversion terminée → on envoie le fichier au client
        res.download(outputFile, "audio.mp3", err => {
        if (err) console.error("Erreur d’envoi:", err);
        fs.unlink(outputFile, () => {}); // suppression du fichier temporaire
      });
    } 
    else {
        res.status(500).json({ error: "Échec de la conversion" });
    }
  });

});

export default router;
