import multer, { StorageEngine } from "multer";
import { Request } from "express";
import slugify from "slugify";

// Helper function to generate a unique filename
const generateUniqueFilename = (file: Express.Multer.File): string => {
  const name = slugify(file.originalname, { lower: true });
  return `${name}-${Date.now()}`;
};

// Configure disk storage
const storage: StorageEngine = multer.diskStorage({
  filename: (
    _: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, generateUniqueFilename(file));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, //1MB
});

export default upload;
