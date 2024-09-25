import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../service/user.service";
import {
  AddCoinToUserInput,
  CreateUserInput,
  SendResetPasswordEmailInput,
  RemoveCoinFromUserInput,
  ResetPasswordInput,
  VerifyUserEmailInput,
} from "../schema/user.schema";
import { omit } from "lodash";
import { coinService } from "../service/coin.service";
import sendEmail from "../utils/mailer";
import logger from "../utils/logger";
import crypto from "crypto";
import { uploadImage } from "../utils/cloudinary";
import { catchAsyncErrors } from "../middleware/asyncErrorWrapper";
import { appAssert } from "../utils/appAssert";
import { AppErrorCode } from "../constants/appErrorCode";
import UserModel from "../models/user.model";

// ----------------------------------------------------------------------

export const getLoggedUserHandler = catchAsyncErrors(
  async (_: Request, res: Response) => {
    const userId = res.locals.user._id;

    const loggedUser = await userService.findById(userId);

    appAssert(
      loggedUser,
      StatusCodes.NOT_FOUND,
      AppErrorCode.USER_NOT_FOUND,
      "User not found"
    );

    return res.json(loggedUser.omitPrivateFields());
  }
);

// ----------------------------------------------------------------------

export const addCoinToUserHandler = catchAsyncErrors(
  async (req: Request<{}, {}, AddCoinToUserInput["body"]>, res: Response) => {
    const userId = res.locals.user._id;
    const { coinId } = req.body;

    const coin = await coinService.findById(coinId);
    appAssert(
      coin,
      StatusCodes.NOT_FOUND,
      AppErrorCode.COIN_NOT_FOUND,
      "Coin not found"
    );

    const user = await userService.findAndUpdate(
      { _id: userId },
      { $addToSet: { coins: coinId } },
      { new: true }
    );

    appAssert(
      user,
      StatusCodes.NOT_FOUND,
      AppErrorCode.USER_NOT_FOUND,
      "User not found"
    );

    return res.status(StatusCodes.OK).send(user);
  }
);

// ----------------------------------------------------------------------

export const removeCoinFromUserHandler = catchAsyncErrors(
  async (
    req: Request<{}, {}, RemoveCoinFromUserInput["body"]>,
    res: Response
  ) => {
    const userId = res.locals.user._id;
    const { coinId } = req.body;

    const coin = await coinService.findById(coinId);
    appAssert(
      coin,
      StatusCodes.NOT_FOUND,
      AppErrorCode.COIN_NOT_FOUND,
      "Coin not found"
    );

    const user = await userService.findAndUpdate(
      { _id: userId },
      { $pull: { coins: coinId } },
      { new: true }
    );

    appAssert(
      user,
      StatusCodes.NOT_FOUND,
      AppErrorCode.USER_NOT_FOUND,
      "User not found"
    );

    return res.status(StatusCodes.OK).send(user);
  }
);

// ----------------------------------------------------------------------

export const deleteCurrentUserHandler = catchAsyncErrors(
  async (_: Request, res: Response) => {
    const userId = res.locals.user._id;

    await userService.delete({ _id: userId });
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
);

// ---------------------------------------------------------------------- using multi part form data

export const uploadProfilePictureHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const userId = res.locals.user._id;

    appAssert(
      req.file,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.FILE_NOT_FOUND,
      "No file uploaded"
    );

    //TODO
    /* const fileType = null

    if (!fileType || !allowedFormats.includes(fileType)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          "File format is not allowed. Allowed formats are: JPEG, PNG, JPG."
        );
    } */

    // Upload to Cloudinary
    const uploadResult = await uploadImage(req.file.path, `profile_${userId}`);

    appAssert(
      uploadResult,
      StatusCodes.INTERNAL_SERVER_ERROR,
      AppErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to upload image"
    );

    // Update the user's profile picture in the database
    const updatedUser = await userService.updateProfilePicture(
      userId,
      uploadResult.secure_url
    );

    appAssert(
      updatedUser,
      StatusCodes.NOT_FOUND,
      AppErrorCode.USER_NOT_FOUND,
      "User not found"
    );

    return res.status(StatusCodes.OK).send(updatedUser);
  }
);

//TODO
// if I delete a user everything related to it is also deleted, such as the dog. and sessions, or other cases. and set session valid to false
