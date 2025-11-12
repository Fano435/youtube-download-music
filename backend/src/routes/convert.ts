import { Router } from "express";
import ytdl from "ytdl-core";
import { execSync} from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { download } from "../services/ytdlp.js";

export const MAXSIZE = "5G"
const router = Router();

router.get("/", async (req, res) => {
    const videoUrl = req.query.url as string;
    const format = (req.query.format as string) || "mp3";
    
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.status(400).send("Missing or unvalid YouTube URL");
    }
    
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "yt-dlp-"));

      try {
        // Lancement du child process de téléchargement yt-dlp
        await download(videoUrl, tmpDir, format);

        const rawTitle = execSync(`yt-dlp --get-title ${videoUrl}`).toString().trim()
        const safeTitle = rawTitle.replace(/[^\w\s()\[\]-]/g, "").replace(/\s+/g, " ")

        const files = fs.readdirSync(tmpDir);
        const downloadedFile = path.join(tmpDir, files[0]);
        const extension = path.extname(downloadedFile)

        res.download(downloadedFile, safeTitle + extension, (err) => {
            if (err) {
                res.status(500).json({ error: "Error sending file" });
            }
        });
      }
      catch (err) {
        res.status(500).json({error: err.message})
      }
      finally {
        fs.rm(tmpDir, { recursive: true, force: true}, () => {});
      }

});

export default router;
