import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";

export class AppError extends Error {
  public readonly statusCode: StatusCodes;
  public readonly codeName: AppErrorCode;
  public readonly isOperational: boolean;

  constructor(
    statusCode: StatusCodes,
    codeName: AppErrorCode,
    message: string,
    isOperational: boolean
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.statusCode = statusCode;
    this.codeName = codeName;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

//TODO do test --coverage at the end.
