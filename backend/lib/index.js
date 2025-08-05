import express from "express";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import { Readable } from "stream";
import { uploadAudioToCloudinary } from "../services/uploadToCloudinary.js";
import { deleteAudioFromCloudinary } from "../services/deleteFromCloudinary.js";
import { extractVideoId } from "./extractId.js";
import { fetchYoutubeVideoData } from "./fetchYoutubeVideoData.js";
import { config } from "dotenv";
import { fetchYoutubeMetadata } from "./fetchYoutubeMetadataYTDLP.js";
import { log } from "console";
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(
  cors({
    origin: "*", // or replace * with your frontend domain for stricter control
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use("/downloads", express.static("downloads"));
app.get("/", (req, res) => {
  res.send("YouTube to MP3 API is running! 🎵");
});
app.get("/home", (req, res) => {
  res.send("YouTube to MP3 API is on! 🎵");
});

app.post("/api/download-and-upload", async (req, res) => {
  const { url } = req.body;
  console.log(url);

  if (!url) return res.status(400).json({ error: "URL is required" });

  const videoId = extractVideoId(url);
  if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL" });

  const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const ytCommand = `yt-dlp -x --audio-format mp3 -o- ${cleanUrl}`;
  console.log(ytCommand);

  try {
    const child = exec(ytCommand, { encoding: "buffer", maxBuffer: Infinity });
    // console.log(child);
    
    const audioStream = Readable.from(child.stdout);
    console.log("AS",audioStream); 

    const result = await uploadAudioToCloudinary(audioStream, videoId); // you can use videoId or a static string if you prefer
    console.log(result);

    res.json({
      message: "Upload complete",
      cloudinaryUrl: result.secure_url,
      public_id: result.public_id,
    });

    child.stderr.on("data", (data) =>
      console.error("yt-dlp stderr:", data.toString())
    );
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Cloud upload failed." });
  }
});

app.post("/api/video-info", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]|$)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL" });

  try {
    const info = await fetchYoutubeMetadata(videoId);
    res.json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch video info." });
  }
});
app.delete("/api/delete/:publicId", async (req, res) => {
  const { publicId } = req.params;
  try {
    const result = await deleteAudioFromCloudinary(publicId);
    res.json({ message: "File deleted successfully", result });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Cloud delete failed." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
