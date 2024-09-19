import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../../constants/appErrorCode";
import supertest from "supertest";

export const unauthorizedError = {
  statusCode: StatusCodes.UNAUTHORIZED,
  codeName: AppErrorCode.UNAUTHORIZED,
  message: "You must be authenticated to access this route",
  isOperational: true,
};

export const forbiddenError = {
  statusCode: StatusCodes.FORBIDDEN,
  codeName: AppErrorCode.FORBIDDEN,
  message: "You are not allowed to access this route",
  isOperational: true,
};

export const validationFailedError = {
  statusCode: StatusCodes.BAD_REQUEST,
  codeName: AppErrorCode.VALIDATION_FAILED,
  message: "Validation failed",
  errors: [
    {
      code: expect.any(String),
      message: expect.any(String),
      path: expect.any(String),
    },
  ],
  isOperational: true,
};

export const unsopportedFileTypeError = {
  statusCode: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
  codeName: AppErrorCode.INVALID_FILE_TYPE,
  message: "Invalid file type",
  errors: [
    {
      code: expect.any(String),
      message: expect.any(String),
      path: expect.any(String),
    },
  ],
  isOperational: true,
};

export const fileTooLongError = {
  statusCode: StatusCodes.REQUEST_TOO_LONG,
  codeName: AppErrorCode.FILE_TOO_BIG,
  message: "File is too big. Max is 2mb",
  errors: [
    {
      code: expect.any(String),
      message: expect.any(String),
      path: expect.any(String),
    },
  ],
  isOperational: true,
};

// HELPER FUNCTIONS ---------------------------------------------

export const authenticatedRequest = (request: supertest.Test) =>
  request
    .set("Authorization", `Bearer ${"adminAccessToken"}`)
    .set("x-refresh", "adminRefreshToken");
