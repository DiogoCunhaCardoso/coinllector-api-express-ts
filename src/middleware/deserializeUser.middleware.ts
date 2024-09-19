import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import { sessionService } from "../service/session.service";
import config from "config";

/**
 *  Decodes a JWT from the request headers & attaches the user info to res.locals.user
 */
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.refreshToken") ||
    (get(req, "headers.x-refresh") as string);
  // ----------------------------------------------------------------------

  if (!accessToken) return next();

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  /*  if (decoded) {
    // Verify if the user exists
    const user = await userService.findById(decoded._id);
    if (user) {
      res.locals.user = decoded;
      return next();
    } else {
      // User no longer exists
      return res.status(401).send("User no longer exists"); //CODESTSTUAS NOT 401
    }
  } */

  // REFRESH TOKEN -> REISSUE ACCESS TOKEN --------------------------------

  if (expired && refreshToken) {
    const newAccessToken = await sessionService.reIssueAccessToken({
      refreshToken,
    });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", accessToken, {
        maxAge: 900000, // 15 min
        httpOnly: true,
        domain: config.get<string>("domain"),
        path: "/",
        sameSite: "strict",
        secure: false, // false == http. true == only https.
      });

      const { decoded } = verifyJwt(newAccessToken);

      res.locals.user = decoded;
    }
  }

  return next();
};
