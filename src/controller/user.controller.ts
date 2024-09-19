import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../service/user.service";
import {
  AddCoinToUserInput,
  CreateUserInput,
  ForgotPasswordInput,
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

//TODO - mime type allowed

export const createUserHandler = catchAsyncErrors(
  async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
    const userExists = await userService.findByProp({ email: req.body.email });

    appAssert(
      !userExists,
      StatusCodes.CONFLICT,
      AppErrorCode.EMAIL_IN_USE,
      "Email is already in use"
    );

    const user = await userService.create(req.body);

    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your account",
      text: `Verification code ${user.verificationCode}. Id: ${user._id}`,
    }); // TODO change to the email I am going to use to send this emails. use env for that
    return res.status(StatusCodes.CREATED).send(omit(user, "password"));
  }
);

// ----------------------------------------------------------------------

export const getCurrentUserHandler = catchAsyncErrors(
  async (_: Request, res: Response) => {
    return res.send(omit(res.locals.user, "scopes"));
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
//TODO use OTP
export const verifyUserEmailHandler = catchAsyncErrors(
  async (req: Request<VerifyUserEmailInput["params"]>, res: Response) => {
    const { id, verificationCode } = req.params;

    // find user by ID
    const user = await userService.findById(id);
    appAssert(
      user,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.BAD_REQUEST,
      "Could not verify user"
    );

    // check if already verified
    appAssert(
      !user.emailVerified,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.BAD_REQUEST,
      "User is already verified"
    );

    appAssert(
      user.verificationCode === verificationCode,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.BAD_REQUEST,
      "Could not verify user"
    );

    user.emailVerified = true;
    await user.save();

    return res.status(StatusCodes.OK).send("User successfully verified");
  }
);

// ----------------------------------------------------------------------

export const forgotPasswordHandler = catchAsyncErrors(
  async (req: Request<{}, {}, ForgotPasswordInput["body"]>, res: Response) => {
    const message =
      "If a user with that email is registered you will receive a password reset email";
    const { email } = req.body;

    const user = await userService.findByProp({ email }, { lean: false });

    logger.debug(
      `Checking user existence: ${user ? "User exists" : "User not found"}`
    );

    appAssert(user, StatusCodes.OK, AppErrorCode.OK, message);

    appAssert(
      user.emailVerified,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.BAD_REQUEST,
      "User is not verified"
    );

    const passwordResetCode = crypto.randomInt(10000000, 99999999).toString();
    user.passwordResetCode = passwordResetCode;

    await user.save();

    await sendEmail({
      to: user.email,
      from: "test@example.com", // TODO Real email
      subject: "Reset your password",
      text: `Password reset code: ${passwordResetCode}. Id: ${user._id}`,
    });

    logger.debug(`Password reset email sent to ${email}`);
    return res.send(message);
  }
);

// ----------------------------------------------------------------------

export const resetPasswordHandler = catchAsyncErrors(
  async (
    req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
    res: Response
  ) => {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;

    const user = await userService.findById(id);

    appAssert(
      user && user.passwordResetCode === passwordResetCode,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.PASSWORD_RESET_FAILED,
      "Could not reset user password"
    );

    user.passwordResetCode = "";
    user.password = password;

    await user.save();

    return res.status(StatusCodes.OK).send("Successfully updated password");
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

//TODO logout -> invalidate session. (clear cookies from use browser. reset access and refresh and set to ttl -1 to invalidate.)
// if I delete a user everything related to it is also deleted, such as the dog. and sessions, or other cases. and set session valid to false
