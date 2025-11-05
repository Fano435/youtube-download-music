import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { MAXSIZE } from "../routes/convert.js";

export function download(
    videoUrl: string,
    tmpFile: string,
    format: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        let process: ChildProcessWithoutNullStreams;
        if (format == "mp3" || format == "m4a") {
            process = spawn("yt-dlp", [
                "--no-playlist",
                "--max-filesize",
                MAXSIZE,
                "-f",
                "bestaudio",
                "--check-formats",
                "-x",
                "--audio-format",
                format,
                "-o",
                tmpFile,
                videoUrl,
            ]);
        } else if (format == "mp4") {
            process = spawn("yt-dlp", [
                "-S",
                "ext",
                "--no-playlist",
                "--max-filesize",
                MAXSIZE,
                "-o",
                tmpFile,
                videoUrl,
            ]);
        }

        let stdmsg = "";
        let error = "";

        process.stdout.on("data", (data) => {
            stdmsg += data.toString();
        });

        process.stderr.on("data", (data) => {
            error += data.toString();
        });

        process.on("error", (err) => {
            reject(new Error(`Failed to start yt-dlp: ${err.message}`));
            process.kill();
        });

        // TO-DO: improve error parsing to display a clear message to the user
        process.on("close", (code) => {
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
