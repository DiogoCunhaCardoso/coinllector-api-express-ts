import { Request, Response, NextFunction } from "express";

type AsyncController = (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => Promise<any>;

export const catchAsyncErrors = (controller: AsyncController) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (e: any) {
      return next(e);
    }
  };
};
