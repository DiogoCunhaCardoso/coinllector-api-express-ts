import multer, { StorageEngine } from "multer";
import { Request } from "express";
import slugify from "slugify";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_IMAGE_TYPES_NO_PREFIX,
  MAX_IMAGE_SIZE,
} from "../constants/imageRules";

// Helper function to generate a unique filename
const generateUniqueFilename = (file: Express.Multer.File): string => {
  const name = slugify(file.originalname, { lower: true });
  return `${name}-${Date.now()}`;
};

// Configure disk storage
const storage: StorageEngine = multer.diskStorage({
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, generateUniqueFilename(file));
  },
});

const uploadImage = multer({
  storage: storage,
  limits: { fileSize: MAX_IMAGE_SIZE }, //2MB
  fileFilter: (req, file, cb) => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, true);
      return cb(
        new AppError(
          StatusCodes.BAD_REQUEST,
          AppErrorCode.INVALID_FILE_TYPE,
          `Unsupported type. Please use ${ACCEPTED_IMAGE_TYPES_NO_PREFIX}`,
          true
        )
      );
    }
  },
});

export default uploadImage;
