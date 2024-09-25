import { Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/asyncErrorWrapper";
import { LoginInput } from "../schema/session.schema";
import { userService } from "../service/user.service";
import { appAssert } from "../utils/appAssert";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";
import { authService } from "../service/auth.service";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import SessionModel from "../models/session.model";
import {
  CreateUserInput,
  ResetPasswordInput,
  SendResetPasswordEmailInput,
  VerifyUserEmailInput,
} from "../schema";

// REGISTER -> SEND EMAIL -----------------------------------------------------------

export const registerUserHandler = catchAsyncErrors(
  async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
    // Validation
    const userExists = await userService.exists({ email: req.body.email });

    appAssert(
      !userExists,
      StatusCodes.CONFLICT,
      AppErrorCode.EMAIL_IN_USE,
      "Email is already in use"
    );

    // Create user
    const user = await authService.createAccount(req.body);

    return res.status(StatusCodes.CREATED).send(user.omitPrivateFields());
  }
);

// VERIFY USER ----------------------------------------------------------------------

export const verifyUserEmailHandler = catchAsyncErrors(
  async (req: Request<VerifyUserEmailInput["params"]>, res: Response) => {
    const { code } = req.params;

    await authService.verifyEmail(code);

    return res.status(StatusCodes.OK).json({
      message: "Email was successfully verified",
    });
  }
);

// LOGIN -> SESSION -> COOKIES ------------------------------------------------------

export const loginUserHandler = catchAsyncErrors(
  async (req: Request<{}, {}, LoginInput["body"]>, res: Response) => {
    // Validation
    const user = await userService.validatePassword(req.body);

    appAssert(
      user,
      StatusCodes.UNAUTHORIZED,
      AppErrorCode.INVALID_CREDENTIALS,
      "Invalid email or password"
    );

    appAssert(
      user.emailVerified,
      StatusCodes.FORBIDDEN,
      AppErrorCode.EMAIL_NOT_VERIFIED,
      "Please verify your email"
    );

    appAssert(
      user.role,
      StatusCodes.FORBIDDEN,
      AppErrorCode.FORBIDDEN,
      "No role found"
    );

    // Login user
    const { accessToken, refreshToken } = await authService.loginUser(req);

    // Set Cookies
    return setAuthCookies({ res, accessToken, refreshToken })
      .status(StatusCodes.CREATED)
      .json({ message: "Login sucessful" });
  }
);

// PASSWORD RESET EMAIL -------------------------------------------------------------

export const sendPasswordResetEmail = catchAsyncErrors(
  async (
    req: Request<{}, {}, SendResetPasswordEmailInput["body"]>,
    res: Response
  ) => {
    await authService.sendPasswordResetEmail(req.body.email);

    return res
      .status(StatusCodes.OK)
      .json({ message: "Password reset email sent" });
  }
);

// RESET PASSWORD -------------------------------------------------------------------

export const resetPasswordHandler = catchAsyncErrors(
  async (req: Request<{}, {}, ResetPasswordInput["body"]>, res: Response) => {
    await authService.resetPassword(req.body);

    return clearAuthCookies(res).status(StatusCodes.OK).json({
      message: "Password reset successfull",
    });
  }
);

// LOGOUT ---------------------------------------------------------------------------

export const logoutUserHandler = catchAsyncErrors(async (_, res) => {
  // Get logged user session
  const loggedUserSessionId = res.locals.user.sessionId;
  await SessionModel.findByIdAndDelete(loggedUserSessionId);

  // Clear cookies
  return clearAuthCookies(res)
    .status(StatusCodes.OK)
    .json({ message: "Logout successful" });
});
