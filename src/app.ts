import connectDB from "./utils/dbConnect";
import logger from "./utils/logger";
import { swaggerDocs } from "./utils/swagger";
import { createServer } from "./utils/server";
import { config } from "./constants/env";

const app = createServer();

swaggerDocs(app, config.PORT);

app.listen(config.PORT, () => {
  logger.info(`App running: http://localhost:${config.PORT}/healthcheck`);
  logger.info(`Running on ${config.NODE_ENV} environment `);

  connectDB();
});

// TODO REDIS CACHING and rate limiting TomDoestech
