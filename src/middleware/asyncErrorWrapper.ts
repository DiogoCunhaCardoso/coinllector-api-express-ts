import { Request, Response, NextFunction } from "express";

export const catchAsyncErrors = (handler: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e: any) {
      return next(e);
    }
  };
};
