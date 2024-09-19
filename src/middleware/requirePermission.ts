import { Request, Response, NextFunction } from "express";
import { PermissionType } from "../constants/permissions";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";
import { AppError } from "../utils/appError";

export const requirePermission = (requiredPermission: PermissionType) => {
  return (_: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    const scopes: PermissionType[] = user?.scopes;

    if (!scopes || !scopes.includes(requiredPermission)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        AppErrorCode.FORBIDDEN,
        "You are not allowed to access this route",
        true
      );
    }
    // Permission granted
    return next();
  };
};
