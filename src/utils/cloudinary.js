import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

export const fileUploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("inside cloudinary");
    console.log(process.env.CLOUDINARY_NAME);
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });
    console.log(uploadResult);
    return uploadResult;
  } catch (error) {
    console.log("error while uploading:", error);
    console.log("avatar removed...");
    fs.unlink(localFilePath);
    return null;
  }
};
