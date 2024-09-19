import express from "express";
import { deserializeUser } from "../middleware/deserializeUser.middleware";
import routes from "../routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "config";
import helmet from "helmet";
import { globalRateLimiter } from "./ratelimiter";
import { errorHandler } from "../middleware/errorHandler";

export const createServer = () => {
  const app = express();

  app.use(helmet());
  app.use(globalRateLimiter);

  app.use(
    cors({
      origin: config.get<string>("origin"),
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(deserializeUser);

  routes(app);

  app.use(errorHandler);

  return app;
};

// TODO i18n in future. using accept headers and cookies
/* 
https://github.com/zowe/sample-spring-boot-api-service/blob/master/zowe-rest-api-sample-spring/docs/i18n.md
https://octo-woapi.github.io/cookbook/internationalization.html
https://medium.com/@abdulwasa.abdulkader/api-internationalization-in-fastapi-21fdf150a88d

*/
