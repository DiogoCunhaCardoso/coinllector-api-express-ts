import assert from "node:assert";
import { AppError } from "./appError";
import { AppErrorCode } from "../constants/appErrorCode";
import { StatusCodes } from "http-status-codes";

type AppAssert = (
  condition: any,
  statusCode: StatusCodes,
  codeName: AppErrorCode,
  message: string
) => asserts condition;

/**
 *  Asserts a condition and throws an AppError if the condition is falsy.
 */
export const appAssert: AppAssert = (
  condition,
  statusCode,
  codeName,
  message
) => {
  assert(condition, new AppError(statusCode, codeName, message, true));
};

//TODO success with message status and data {}
//TODO also make the schemas errors be the same format.

//https://www.youtube.com/watch?v=NR2MJk9C1Js&t=11135s

//import { AppError } from "./appError";
//import { AppErrorCode } from "../constants/appErrorCode";
//import { StatusCodes } from "http-status-codes";
//
///**
// * Asserts a condition and throws an AppError if the condition is falsy.
// */
//export const appAssert = (
//  condition: any,
//  statusCode: StatusCodes,
//  codeName: AppErrorCode,
//  message: string
//) => {
//  if (!condition) {
//    throw new AppError(statusCode, codeName, message, true);
//  }
//};
