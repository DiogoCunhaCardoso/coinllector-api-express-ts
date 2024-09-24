import { CookieOptions, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../service/user.service";
import { sessionService } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import logger from "../utils/logger";
import { CreateSessionInput } from "../schema/session.schema";
import { privateFields } from "../models/user.model";
import { omit } from "lodash";
import { ROLE_PERMISSIONS, RoleType } from "../constants/permissions";
import { catchAsyncErrors } from "../middleware/asyncErrorWrapper";
import { appAssert } from "../utils/appAssert";
import { AppErrorCode } from "../constants/appErrorCode";

const DOMAIN = config.get<string>("domain");
const ACCESS_TOKEN_TTL = config.get<string>("accessTokenTtl");
const REFRESH_TOKEN_TTL = config.get<string>("refreshTokenTtl");
const ORIGIN = config.get<string>("origin");

// -----------------------------------------------------------

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15 min
  httpOnly: true,
  domain: DOMAIN,
  path: "/",
  sameSite: "lax",
  secure: false, // TODO create is production flag
};

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1y
};

// -----------------------------------------------------------

// L O G I N _ & _ S E S S I O N

export const createUserSessionHandler = catchAsyncErrors(
  async (req: Request<{}, {}, CreateSessionInput["body"]>, res: Response) => {
    // Validate user's password
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

    // Create a session
    const userAgent = req.get("user-agent") || "";
    const session = await sessionService.create(user._id, userAgent);

    // Create an access token
    const userRole: RoleType = user.role;
    const scopes = ROLE_PERMISSIONS[userRole] || "";

    const userSafePayload = omit(user.toJSON(), privateFields);

    const accessToken = signJwt(
      { ...userSafePayload, scopes, session: session._id },
      { expiresIn: ACCESS_TOKEN_TTL } // 15min
    );

    // Create a refresh token
    const refreshToken = signJwt(
      { ...userSafePayload, scopes, session: session._id },
      { expiresIn: REFRESH_TOKEN_TTL } // 1y
    );

    // Set Cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    // Return both tokens
    res.status(StatusCodes.CREATED).send({ accessToken, refreshToken });
  }
);

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

    const accessToken = signJwt(
      { ...userSafePayload, scopes, session: session._id },
      { expiresIn: ACCESS_TOKEN_TTL } // 15min
    );

    // Create a refresh token
    const refreshToken = signJwt(
      { ...userSafePayload, scopes, session: session._id },
      { expiresIn: REFRESH_TOKEN_TTL } // 1y
    );

    // set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    // redirect back to client
    return res.redirect(ORIGIN);
  } catch (e) {
    logger.error(e, "Failed to authorize Google user");
    return res.redirect(`${ORIGIN}/oauth/error`);
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
