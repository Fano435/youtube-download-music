import { Router } from "express";
import ytdl from "ytdl-core";
import { spawn, execSync} from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { download } from "../services/ytdlp.js";

export const MAXSIZE = "50M"
const router = Router();

router.get("/", async (req, res) => {
    const videoUrl = req.query.url as string;
    const format = (req.query.format as string) || "mp3";
    
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.status(400).send("Missing or unvalid YouTube URL");
    }
    
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "yt-dlp-"));
    const tmpFile = path.join(tmpDir, `dl.${format}`)

      try {
        // Lancement du child process de téléchargement yt-dlp
        await download(videoUrl, tmpFile, format);

        // Execution asynchrone car je suis obligé de récupérer le titre avant de déclencher le téléchargement du fichier vers le client
        const rawTitle = execSync(`yt-dlp --get-title ${videoUrl}`).toString().trim()
        const filename = rawTitle.replace(/[^\w\s()\[\]-]/g, "").replace(/\s+/g, " ")

        res.download(tmpFile, `${filename}.${format}`, err => {
          if (err) {
            res.status(500).json({ error: "Error sending file" }); 
          }
        });
      }
      catch (err) {
        // console.log(err.message)
        res.status(500).json({error: err.message})
      }
      finally {
        fs.rm(tmpDir, { recursive: true, force: true}, () => {});
      }

});

export default router;
