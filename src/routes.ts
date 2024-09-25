import { Express, Response } from "express";
import { StatusCodes } from "http-status-codes";
import countryRoutes from "./routes/country.route";
import coinRoutes from "./routes/coin.route";
import sessionRoutes from "./routes/session.route";
import authRoutes from "./routes/auth.route";
import usersRoutes from "./routes/user.route";
//
//
//
//
//
// REMOVE AFTER (whats below)
import qs from "qs";
import { config } from "./constants/env";

const routes = (app: Express) => {
  /**
   * @openapi
   * /healthcheck:
   *   get:
   *     tags:
   *       - Healthcheck
   *     description: Responds if app is up and running
   *     responses:
   *       '200':
   *         description: App is up and running
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *               example: "OK"
   */

  app.get("/healthcheck", (_, res: Response) => res.sendStatus(StatusCodes.OK));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/sessions", sessionRoutes);
  app.use("/api/countries", countryRoutes);
  app.use("/api", coinRoutes);

  // REMOVE AFTER
  function getGoogleAuthUrl() {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      client_id: config.GOOGLE.CLIENT_ID,
      redirect_uri: config.GOOGLE.OAUTH_REDIRECT_URL,
      response_type: "code",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      access_type: "offline",
      prompt: "consent",
    };

    const url = `${googleAuthUrl}?${qs.stringify(options)}`;
    return url;
  }

  app.get("/auth/google", (req, res) => {
    const authUrl = getGoogleAuthUrl();
    res.redirect(authUrl);
  });
};

export default routes;

// TODO
// if a coin is deleted, every user with that coin id will stop having it.
// cron -> 2 years innactive & some else
