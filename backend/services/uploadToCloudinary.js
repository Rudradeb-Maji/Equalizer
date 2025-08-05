// import streamifier from "streamifier";
import cloudinary from "../config/cloudinaryConfig.js";

export const uploadAudioToCloudinary = (audioStream) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "yt-audios"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    audioStream.pipe(uploadStream);
  });
};
