import { CookieOptions, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../service/user.service";
import { sessionService } from "../service/session.service";
import { signToken } from "../utils/jwt.utils";
import logger from "../utils/logger";
import { privateFields } from "../models/user.model";
import { omit } from "lodash";
import { ROLE_PERMISSIONS, RoleType } from "../constants/permissions";
import { catchAsyncErrors } from "../middleware/asyncErrorWrapper";
import { appAssert } from "../utils/appAssert";
import { AppErrorCode } from "../constants/appErrorCode";
import { config } from "../constants/env";

// -----------------------------------------------------------

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15 min
  httpOnly: true,
  domain: config.DOMAIN,
  path: "/",
  sameSite: "lax",
  secure: false,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1y
};

// -----------------------------------------------------------

// CREATE WITH GOOGLE ----------------------------------------------------

export const googleOauthSessionHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // get code from query string
    const code = req.query.code as string;

    appAssert(
      code,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.BAD_REQUEST,
      "Missing Google OAuth code"
    );

    // get ID & access token w/ the code
    const { id_token, access_token } = await userService.getGoogleOauthTokens({
      code,
    });

    // get user with tokens
    const googleUser = await userService.getGoogleUser({
      id_token,
      access_token,
    });

    appAssert(
      googleUser.verified_email,
      StatusCodes.FORBIDDEN,
      AppErrorCode.FORBIDDEN,
      "Google account is not verified"
    );

    // upsert user
    const user = await userService.findAndUpdate(
      { email: googleUser.email },
      {
        email: googleUser.email,
        name: googleUser.name,
        pfp: googleUser.picture,
        emailVerified: true,
      },
      { upsert: true, new: true }
    );

    // create session
    const userAgent = req.get("user-agent") || "";
    const session = await sessionService.create(user._id, userAgent);

    // Create an access token
    const userRole: RoleType = user.role;
    const scopes = ROLE_PERMISSIONS[userRole] || "";

    const userSafePayload = omit(user.toJSON(), privateFields);

    const accessToken = signToken(
      { ...userSafePayload, scopes, session: session._id },
      { expiresIn: config.ACCESS_TOKEN_TTL } // 15min
    );

    // Create a refresh token
    const refreshToken = signToken(
      { ...userSafePayload, scopes, session: session._id },
      { expiresIn: config.REFRESH_TOKEN_TTL } // 1y
    );

    // set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    // redirect back to client
    return res.redirect(config.APP_ORIGIN);
  } catch (e) {
    logger.error(e, "Failed to authorize Google user");
    return res.redirect(`${config.APP_ORIGIN}/oauth/error`);
  }
};

// ----------------------------------------------------------------------
// Middleware puts user in res.locals.user (deserializeUser)
// Middleware verifies user in required before this handler is processed (requireUser)

export const getUserSessionsHandler = catchAsyncErrors(
  async (_: Request, res: Response) => {
    const userId = res.locals.user._id;

    const sessions = await sessionService.find({ user: userId, valid: true });
    return res.send(sessions);
  }
);

// ----------------------------------------------------------------------

export const deleteUserSessionHandler = catchAsyncErrors(
  async (_: Request, res: Response) => {
    const sessionId = res.locals.user.session;

    await sessionService.update({ _id: sessionId }, { valid: false });

    return res.send({
      accessToken: null,
      refreshoken: null,
    });
  }
);

// TODO not using the delete session in a meaningfull way
