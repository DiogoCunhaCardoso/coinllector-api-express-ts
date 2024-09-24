import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/appError";
import logger from "../utils/logger";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";
import { ZodError } from "zod";
import { MulterError } from "multer";

const handleAppError = (res: Response, e: AppError) => {
  res.status(e.statusCode).json({
    statusCode: e.statusCode,
    codeName: e.codeName,
    message: e.message,
    isOperational: e.isOperational,
  });
};

const handleZodError = (res: Response, e: ZodError) => {
  const errors = e.errors.map((error) => ({
    code: error.code,
    message: error.message,
    path: error.path.join("."),
  }));

  res.status(StatusCodes.BAD_REQUEST).json({
    statusCode: StatusCodes.BAD_REQUEST,
    codeName: AppErrorCode.VALIDATION_FAILED,
    message: "Validation failed",
    errors,
    isOperational: true,
  });
};

const handleMulterError = (res: Response, e: MulterError) => {
  let message = "An error occurred during file upload";
  let codeName = AppErrorCode.FILE_UPLOAD_FAILED;

  switch (e.code) {
    case "LIMIT_UNEXPECTED_FILE":
      message = "Only one file must be uploaded";
      codeName = AppErrorCode.TOO_MANY_FILES;
      break;
    case "LIMIT_FILE_SIZE":
      message = "File size exceeds the limit";
      codeName = AppErrorCode.FILE_TOO_BIG;
      break;
    default:
      message = e.message || message;
  }

  res.status(StatusCodes.BAD_REQUEST).json({
    statusCode: StatusCodes.BAD_REQUEST,
    codeName,
    message,
    isOperational: true,
  });
};

const handleUnknownError = (res: Response, e: any) => {
  logger.error(e);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    codeName: AppErrorCode.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
    isOperational: false,
  });
};

export const errorHandler: ErrorRequestHandler = (e, req, res, next) => {
  if (e instanceof AppError) {
    return handleAppError(res, e);
  }

  if (e instanceof ZodError) {
    return handleZodError(res, e);
  }

  if (e instanceof MulterError) {
    return handleMulterError(res, e);
  }

  return handleUnknownError(res, e);
};
