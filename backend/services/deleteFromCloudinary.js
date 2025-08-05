import cloudinary from "../config/cloudinaryConfig.js";

export const deleteAudioFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "video" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};
