import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { appAssert } from "../utils/appAssert";
import { AppErrorCode } from "../constants/appErrorCode";

// This middleware is used in every route the user is required

export const requireUser = (_: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  appAssert(
    user,
    StatusCodes.UNAUTHORIZED,
    AppErrorCode.UNAUTHORIZED,
    "You must be authenticated to access this route"
  );

  return next();
};
