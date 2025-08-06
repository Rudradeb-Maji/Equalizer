const express = require("express");
const { Innertube, UniversalCache } = require("youtubei.js");
const app = express();
const cors = require("cors");
const YTDlpWrap = require("yt-dlp-wrap").default; // ✅ Named import, with correct casing
const ytdlp = new YTDlpWrap('./yt-dlp');
const PORT = 5000;
const { Client } = require("youtubei.js");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  })
);
// const youtube = new Client().default();
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

app.get("/api/audio", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("Missing YouTube URL");

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const stream = ytdlp.execStream([
      videoUrl,
      "-f",
      "bestaudio",
      "-o",
      "-",
      "--quiet",
      "--no-playlist",
      "--extract-audio",
      "--audio-format",
      "mp3",
    ]);

    stream.pipe(res);

    stream.on("error", (err) => {
      console.error("yt-dlp error:", err);
      res.status(500).send("Streaming failed");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/api/video-info", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) throw new Error("Missing YouTube URL");
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error("Invalid YouTube URL");

  try {
    // Fetch video details
    const yt = await Innertube.create({ cache: new UniversalCache(true) });
    const videoInfo = await yt.actions.execute("/player", {
      // You can add any additional payloads here, and they'll merge with the default payload sent to InnerTube.
      videoId,
      client: "WEB", // InnerTube client to use.
      parse: true, // tells YouTube.js to parse the response (not sent to InnerTube).
    });
    console.log(videoInfo.video_details.thumbnail);

    const video = {
      title: videoInfo.video_details.title,
      thumbnail: videoInfo.video_details.thumbnail[0].url,
    };
    res.send(video);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
