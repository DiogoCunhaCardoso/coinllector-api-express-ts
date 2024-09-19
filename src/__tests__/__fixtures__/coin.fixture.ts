import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../../constants/appErrorCode";

export const validCoinId = new mongoose.Types.ObjectId().toString();

export const invalidCoinId = "abcdefghijklmnopqrstuvwxyz";

export const validCoin = {
  _id: validCoinId,
  type: "commemorative",
  image: "http://placehold.co/250",
  quantity: 33500,
  period: {
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  description: "A commemorative coin for 2024",
  country: "portugal",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

export const validPatchCoin = {
  description: "A updated commemorative coin description for 2024",
};

export const noRequiredFieldsCoin = {};

export const invalidEnumCoin = {
  ...validCoin,
  type: "invalid-type-enum",
};

export const invalidQuantityCoin = {
  ...validCoin,
  quantity: -10000,
};

export const invalidQuantityWithTypeCoin = {
  ...validCoin,
  type: "2 EURO",
};

export const invalidPeriodCoin = {
  ...validCoin,
  period: {
    startDate: "2024-12-31",
    endDate: "2024-01-01",
  },
};

// ERRORS -------------------------------------------------

export const coinNotFoundError = {
  statusCode: StatusCodes.NOT_FOUND,
  codeName: AppErrorCode.COIN_NOT_FOUND,
  message: "Coin not found",
  isOperational: true,
};

export const unsupportedMediaTypeError = {
  statusCode: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
  codeName: AppErrorCode.INVALID_FILE_TYPE,
  message: "Invalid file type",
  errors: [
    {
      code: "INVALID_FILE",
      message: "The provided file is of an unsupported type",
      path: "image",
    },
  ],
  isOperational: true,
};

export const fileTooLargeError = {
  statusCode: StatusCodes.REQUEST_TOO_LONG,
  codeName: AppErrorCode.FILE_TOO_BIG,
  message: "File is too big. Max is 2mb",
  errors: [
    {
      code: "FILE_TOO_LARGE",
      message: "The uploaded file exceeds the maximum allowed size",
      path: "image",
    },
  ],
  isOperational: true,
};
