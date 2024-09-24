import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../../constants/appErrorCode";

export const validCountryId = new mongoose.Types.ObjectId().toString();

export const validCountryName = "portugal";

export const invalidCountryName = "abcdefghijklmnopqrstuvwxyz";

export const countryNotFoundError = {
  statusCode: StatusCodes.NOT_FOUND,
  codeName: AppErrorCode.COUNTRY_NOT_FOUND,
  message: "Country not found",
  isOperational: true,
};

//
//
//
//
//
//
//

export const countryPayload = {
  _id: validCountryId,
  name: "andorra",
  date: "2001-01-14",
  flagImage: "http://placehold.co/400",
};

export const newCountryPayload = {
  name: "portugal",
  flagImage: "http://placehold.co/400",
  joinedOn: "2022-01-02",
};

export const newCountryPayloadWithoutRequiredFields = {};

export const newCountryPayloadWithInvalidFields = {
  name: "",
  flagImage: "not-a-valid-url",
  joinedOn: "20220102",
};
