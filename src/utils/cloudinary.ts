import { v2 as cloudinary } from "cloudinary";
import { config } from "../constants/env";
import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";
import logger from "./logger";

cloudinary.config({
  cloud_name: config.CLOUDINARY.NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET,
});

export const uploadImage = async (imageUrl: string, publicId?: string) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      width: 250,
      height: 250,
      quality: "auto",
      crop: "fill",
      gravity: "face", // AI to detect faces and crop correctly.
    });
    return uploadResult;
  } catch (error) {
    logger.error("Error uploading to Cloudinary", error);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      AppErrorCode.INTERNAL_SERVER_ERROR,
      "An unexpected error occurred",
      false
    );
  }
};
