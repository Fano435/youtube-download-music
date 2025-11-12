import { spawn } from "child_process";
import { MAXSIZE } from "../routes/convert.js";
import fs from "fs";
import path from "path";

export function download(
    videoUrl: string,
    tmpDir: string,
    format: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        const baseArgs = [
            "--no-playlist",
            "--max-filesize",
            MAXSIZE,
            "-P",
            tmpDir,
            videoUrl,
        ];

        const formatArgs: Record<string, string[]> = {
            mp3: ["-x", "--audio-format", "mp3"],
            m4a: ["-x", "--audio-format", "m4a"],
            mp4: ["--format-sort", "vext", "--check-formats"],
        };

        const downloadArgs = [...baseArgs, ...(formatArgs[format] || [])];

        const child = spawn("yt-dlp", downloadArgs);

        let stdmsg = "";
        let error = "";

        child.stdout.on("data", (data) => {
            stdmsg += data.toString();
        });

        child.stderr.on("data", (data) => {
            error += data.toString();
        });

        child.on("error", (err) => {
            reject(new Error(`Failed to start yt-dlp: ${err.message}`));
            child.kill();
        });

        // TO-DO: improve error parsing to display a clear message to the user
        child.on("close", (code) => {
            const parsed = stdmsg.toLocaleLowerCase();
            if (parsed.includes("aborting")) {
                const reason = parsed
                    .split("\n")
                    .find((line) => line.includes("aborting"));

                return reject(new Error(`yt-dlp stopped : ${reason.trim()}`));
            }
            if (code != 0) {
                return reject(new Error(`yt-dlp failed : ${error.trim()}`));
            }
            return resolve();
        });
    });
}
