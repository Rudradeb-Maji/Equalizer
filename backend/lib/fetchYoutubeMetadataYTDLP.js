import { execFile } from "child_process";
import path from "path";

export function fetchYoutubeMetadata(url) {
  return new Promise((resolve, reject) => {
    const ytdlpPath = path.join(process.cwd(), "bin", "yt-dlp");

    execFile(
      ytdlpPath,
      ["--dump-single-json", url],
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ yt-dlp metadata fetch error:", error);
          return reject(error);
        }
        try {
          const info = JSON.parse(stdout);
          resolve(info);
        } catch (parseError) {
          console.error("❌ Error parsing yt-dlp output:", parseError);
          reject(parseError);
        }
      }
    );
  });
}
