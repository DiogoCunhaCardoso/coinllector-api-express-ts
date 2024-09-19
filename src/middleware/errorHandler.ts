import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import logger from "../utils/logger";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";
import { ZodError } from "zod";

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

const handleUnknownError = (res: Response, e: any) => {
  logger.error(e);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    codeName: AppErrorCode.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
    isOperational: false,
  });
};

export const errorHandler = (
  e: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (e instanceof AppError) {
    return handleAppError(res, e);
  }

  if (e instanceof ZodError) {
    return handleZodError(res, e);
  }

  return handleUnknownError(res, e);
};
