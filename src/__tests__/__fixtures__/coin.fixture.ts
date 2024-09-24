import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../../constants/appErrorCode";
import { invalidCountryName, validCountryId } from "./country.fixture";

export const validCoinId = new mongoose.Types.ObjectId().toString();

export const invalidCoinId = "abcdefghijklmnopqrstuvwxyz";

export const validCoin = {
  _id: validCoinId,
  type: "COMMEMORATIVE",
  image: "http://placehold.co/250",
  quantity: 33500,
  periodStartDate: "2024-01-01",
  periodEndDate: "2024-12-31",
  description: "A commemorative coin for 2024",
  country: validCountryId,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

// UPDATE -----------------------------------------

export const validPatchCoin = {
  description: "A updated commemorative coin description for 2024",
};

export const invalidCountryNamePatchCoin = {
  country: invalidCountryName,
};

export const invalidEnumPatchCoin = {
  type: "invalid-type-enum",
};

export const invalidQuantityPatchCoin = {
  type: "COMMEMORATIVE",
  quantity: -10000,
};

export const invalidQuantityWithTypePatchCoin = {
  type: "2 EURO",
};

export const noQuantityWithTypePatchCoin = {
  quantity: undefined,
};

// -----------------------------------------

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
  type: "1 CENT",
};

export const noQuantityWithValidTypeCoin = {
  ...validCoin,
  quantity: undefined,
};

export const invalidPeriodCoin = {
  ...validCoin,
  periodStartDate: "2024-12-31",
  periodEndDate: "2024-01-01",
};

export const createCoin = {
  type: "COMMEMORATIVE",
  description: "A special commemorative coin for 2024.",
  quantity: 1000,
  image: "https://example.com/coin-2024.jpg",
  periodStartDate: "2024-01-01",
  periodEndDate: "2024-12-31",
};

// ERRORS -------------------------------------------------

export const coinNotFoundError = {
  statusCode: StatusCodes.NOT_FOUND,
  codeName: AppErrorCode.COIN_NOT_FOUND,
  message: "Coin not found",
  isOperational: true,
};

export const noRequiredFieldsCoinError = {
  statusCode: StatusCodes.BAD_REQUEST,
  codeName: AppErrorCode.VALIDATION_FAILED,
  message: "Validation failed",
  errors: [
    {
      code: "invalid_type",
      message:
        "Type is required and must be one of the defined enum values: COMMEMORATIVE, 2 EURO, 1 EURO, 50 CENT, 20 CENT, 10 CENT, 5 CENT, 2 CENT, 1 CENT",
      path: "body.type",
    },
    {
      code: "invalid_date",
      message: "Invalid date",
      path: "body.periodStartDate",
    },
    {
      code: "invalid_type",
      message: "Description is required",
      path: "body.description",
    },
  ],
  isOperational: true,
};

export const invalidEnumCoindError = {
  statusCode: StatusCodes.BAD_REQUEST,
  codeName: AppErrorCode.VALIDATION_FAILED,
  message: "Validation failed",
  errors: [
    {
      code: "invalid_enum_value",
      message:
        "Invalid enum value. Expected 'COMMEMORATIVE' | '2 EURO' | '1 EURO' | '50 CENT' | '20 CENT' | '10 CENT' | '5 CENT' | '2 CENT' | '1 CENT', received 'invalid-type-enum'",
      path: "body.type",
    },
  ],
  isOperational: true,
};

export const invalidQuantityWithTypeCoinError = {
  statusCode: StatusCodes.BAD_REQUEST,
  codeName: AppErrorCode.VALIDATION_FAILED,
  message: "Validation failed",
  errors: [
    {
      code: "custom",
      message: "Quantity must be present for commemorative coins only",
      path: "body.quantity",
    },
  ],
  isOperational: true,
};

export const invalidPeriodCoinError = {
  statusCode: StatusCodes.BAD_REQUEST,
  codeName: AppErrorCode.VALIDATION_FAILED,
  message: "Validation failed",
  errors: [
    {
      code: "custom",
      message: "StartDate must be before EndDate",
      path: "body.startDate.endDate",
    },
  ],
  isOperational: true,
};

export const negativeQuantityCoindError = {
  statusCode: StatusCodes.BAD_REQUEST,
  codeName: AppErrorCode.VALIDATION_FAILED,
  message: "Validation failed",
  errors: [
    {
      code: "too_small",
      message: "Number must be greater than 0",
      path: "body.quantity",
    },
  ],
  isOperational: true,
};

export const unsupportedMediaTypeError = {
  statusCode: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
  codeName: AppErrorCode.INVALID_FILE_TYPE,
  message: "Invalid file type",
  errors: [
    {
      code: "INVALID_FILE",
      message: "Unsupported type. Please use png, jpg, or jpeg.",
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
