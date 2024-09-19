import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { appAssert } from "../utils/appAssert";
import { AppErrorCode } from "../constants/appErrorCode";
import { StatusCodes } from "http-status-codes";

// Global -------------------------------------------------------------------------

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min
  handler: (req: Request, res: Response) => {
    appAssert(
      false,
      StatusCodes.TOO_MANY_REQUESTS,
      AppErrorCode.TOO_MANY_REQUESTS,
      "Too many requests! Try again later."
    );
  },
});

// For Login ----------------------------------------------------------------------

export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  handler: (req: Request, res: Response) => {
    appAssert(
      false,
      StatusCodes.TOO_MANY_REQUESTS,
      AppErrorCode.TOO_MANY_REQUESTS,
      "Too many requests! Try again later."
    );
  },
});

// For Sending Recovery Password ---------------------------------------------------

export const recoverPasswordRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1,
  handler: (req: Request, res: Response) => {
    appAssert(
      false,
      StatusCodes.TOO_MANY_REQUESTS,
      AppErrorCode.TOO_MANY_REQUESTS,
      "Try again in one minute."
    );
  },
});

//TODO maybe switch to redis. if I do cache in redis.
