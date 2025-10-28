import { Router } from "express";
import ytdl from "ytdl-core";
import { spawn, execSync} from "child_process";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/", async (req, res) => {
    const videoUrl = req.query.url as string;
    
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.status(400).send("Missing or unvalid YouTube URL");
    }
    // console.log("URL reçue :", videoUrl)
    
    const rawTitle = execSync(`yt-dlp --get-title ${videoUrl}`).toString().trim()
    const filename = rawTitle.replace(/[^\w\s()\[\]-]/g, "").replace(/\s+/g, " ")

    // console.log("Music Title : ", rawTitle)
    // console.log("Filename : ", filename)
    const tmpFile = path.join("/tmp", `audio_${Date.now()}.mp3`)

    // Lancement du child process yt-dlp
    const ytdlp = spawn("yt-dlp", [
    "-f", "bestaudio",
    "-x", "--audio-format", "mp3",
    "-o", tmpFile,
    videoUrl
    ])

    // On log les erreurs de yt-dlp
    ytdlp.stderr.on("data", data => { console.error("yt-dlp:", data.toString()); })

    // Quand yt-dlp se termine
    ytdlp.on("close", code => {
    if (code === 0) {
        // conversion terminée → on envoie le fichier au client
        res.download(tmpFile, `${filename}.mp3`, err => {
        if (err) console.error("Erreur d’envoi:", err);
        fs.unlink(tmpFile, () => {}); // suppression du fichier temporaire
      });
    } 
    else {
        res.status(500).json({ error: "Échec de la conversion" });
    }
  });

});

export default router;
