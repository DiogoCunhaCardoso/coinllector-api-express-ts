import { Request } from "express";
import UserModel from "../models/user.model";
import { config } from "../constants/env";
import { sessionService } from "./session.service";
import { signToken } from "../utils/jwt.utils";
import { LoginInput } from "../schema/session.schema";
import VerificationCodeModel from "../models/verificationCode.model";
import { VerificationCodeType } from "../types/verificationCode.types";
import {
  FiveMinutesAgo,
  oneHourFromNow,
  oneYearFromNow,
} from "../constants/time";
import sendEmail from "../utils/mailer";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplate";
import { appAssert } from "../utils/appAssert";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";
import { userService } from "./user.service";
import SessionModel from "../models/session.model";

type CreateAccountParams = {
  email: string;
  password: string;
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const authService = {
  //
  // REGISTER USER ----------------------------------------------------------
  async createAccount(userData: CreateAccountParams) {
    // 1. Create the user
    const user = await UserModel.create(userData);

    // 2. Create Verification code
    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.EMAIL_VERIFICATION,
      expiresAt: oneYearFromNow(),
    });

    // 3. Send Verification email
    const url = `${config.APP_ORIGIN}/email/verify/${verificationCode._id}`;
    await sendEmail({
      to: user.email,
      ...getVerifyEmailTemplate(url),
    });

    return user;
  },

  // VERIFY USER ------------------------------------------------------------
  async verifyEmail(code: string) {
    // 1. Get verification code
    const validCode = await VerificationCodeModel.findOne({
      _id: code,
      type: VerificationCodeType.EMAIL_VERIFICATION,
      expiresAt: { $gt: new Date() },
    });

    appAssert(
      validCode,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.BAD_REQUEST,
      "Invalid or expired verification code"
    );

    // 2. Verify user
    const updatedUser = await UserModel.findByIdAndUpdate(
      validCode.userId,
      {
        emailVerified: true,
      },
      { new: true }
    );

    appAssert(
      updatedUser,
      StatusCodes.INTERNAL_SERVER_ERROR,
      AppErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to verify email"
    );

    // 3. Delete verification code
    await validCode.deleteOne();
  },

  // LOGIN USER -------------------------------------------------------------
  async loginUser(req: Request<{}, {}, LoginInput["body"]>) {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // 2. Validate the password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Session variables
    const userId = user._id;
    const userAgent = req.get("user-agent") || "";

    // 3. Create a session
    const session = await sessionService.create(userId, userAgent);

    // Token variables
    const sessionInfo = {
      sessionId: session._id,
    };

    // 4. Create tokens
    const accessToken = signToken(
      { ...sessionInfo, _id: userId },
      { expiresIn: config.ACCESS_TOKEN_TTL }
    );
    const refreshToken = signToken(
      { ...sessionInfo },
      { expiresIn: config.REFRESH_TOKEN_TTL }
    );

    return { accessToken, refreshToken };
  },

  // SEND RESET EMAIL -------------------------------------------------------

  async sendPasswordResetEmail(email: string) {
    // 1. Find user
    const user = await userService.findByProp({ email }, { lean: false });

    const message =
      "If a user with that email is registered you will receive a password reset email";
    appAssert(user, StatusCodes.OK, AppErrorCode.OK, message);
    const userId = user._id;

    // 2. Rate limit
    const fiveMinAgo = FiveMinutesAgo();

    const count = await VerificationCodeModel.countDocuments({
      userId,
      type: VerificationCodeType.PASSWORD_RESET,
      createdAt: { $gt: fiveMinAgo },
    });

    appAssert(
      count <= 1,
      StatusCodes.TOO_MANY_REQUESTS,
      AppErrorCode.TOO_MANY_REQUESTS,
      "Too many requests, Please try again later"
    );

    // 3. Create verification code
    const expiresAt = oneHourFromNow();
    const verificationCode = await VerificationCodeModel.create({
      userId,
      type: VerificationCodeType.PASSWORD_RESET,
      expiresAt,
    });

    //4. Send verification email

    const url = `${config.APP_ORIGIN}/password/reset?code=${
      verificationCode._id
    }&exp=${expiresAt.getTime()}`;

    await sendEmail({
      to: user.email,
      ...getPasswordResetTemplate(url),
    });

    return { message };
  },

  // RESET PASSWORD
  async resetPassword({ verificationCode, password }: ResetPasswordParams) {
    // 1. Get the verification code
    const validCode = await VerificationCodeModel.findOne({
      _id: verificationCode,
      type: VerificationCodeType.PASSWORD_RESET,
      expiresAt: { $gt: new Date() },
    });
    appAssert(
      validCode,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.BAD_REQUEST,
      "Invalid or expired verification code"
    );

    // 2. Update user password
    const user = await UserModel.findById(validCode.userId);
    appAssert(
      user,
      StatusCodes.NOT_FOUND,
      AppErrorCode.USER_NOT_FOUND,
      "User not found"
    );

    user.password = password;
    await user.save();

    // 3. Delete code and sessions
    await validCode.deleteOne();
    await SessionModel.deleteMany({ userId: validCode.userId });

    // return { user: updatedUser.omitPrivateFields() };
  },
};
