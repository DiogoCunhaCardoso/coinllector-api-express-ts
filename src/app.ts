import dotenv from "dotenv";
dotenv.config();
import config from "config";
import connectDB from "./utils/dbConnect";
import logger from "./utils/logger";
import { swaggerDocs } from "./utils/swagger";

import { createServer } from "./utils/server";

const PORT = config.get<number>("PORT");

const app = createServer();

swaggerDocs(app, PORT);

app.listen(PORT, () => {
  logger.info(`App running: http://localhost:${PORT}/healthcheck`);

  connectDB();
});

// TODO REDIS CACHING and rate limiting TomDoestech
