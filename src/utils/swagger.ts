import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import logger from "./logger";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coinllector REST API Docs",
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        refreshToken: {
          type: "apiKey",
          in: "header",
          name: "x-refresh",
          description: "Refresh token to obtain a new access token.",
        },
      },
    },
  },

  apis: ["./src/models/*.ts", "./src/routes/*.ts", "./src/schema/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number) => {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://localhost:${port}/docs`);
};
