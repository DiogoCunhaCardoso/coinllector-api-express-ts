import { CookieOptions, Response } from "express";
import { config } from "../constants/env"; // Adjust import as necessary
import { FIFTEEN_MINUTES_IN_MS, ONE_YEAR_IN_MS } from "../constants/time";

const secure = config.NODE_ENV !== "development";

//TODO worry about path later

const defaults: CookieOptions = {
  httpOnly: true,
  domain: config.DOMAIN,
  path: "/",
  sameSite: "lax",
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  maxAge: FIFTEEN_MINUTES_IN_MS,
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  maxAge: ONE_YEAR_IN_MS,
});

// ----------------------------------------------------------------------

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

// Set authentication cookies
export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

// Clear authentication cookies
export const clearAuthCookies = (res: Response) =>
  res.clearCookie("accessToken").clearCookie("refreshToken");
