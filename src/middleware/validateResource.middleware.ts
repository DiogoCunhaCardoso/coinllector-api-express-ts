import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject, ZodError } from "zod";
import { AppErrorCode } from "../constants/appErrorCode";
import { AppError } from "../utils/appError";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (e instanceof ZodError) {
        next(e);
      } else {
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          AppErrorCode.INTERNAL_SERVER_ERROR,
          "An unexpected error occurred",
          false
        );
      }
    }
  };

export default validate;
