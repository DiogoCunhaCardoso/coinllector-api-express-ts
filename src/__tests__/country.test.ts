/* import { countryService } from "../service/country.service";
import supertest from "supertest";
import { createServer } from "../utils/server";
import {
  countryPayload,
  newCountryPayload,
  newCountryPayloadWithInvalidFields,
  newCountryPayloadWithoutRequiredFields,
} from "./__fixtures__/country.fixture";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";
import { authenticatedRequest } from "./__fixtures__/global.fixture";

const app = createServer();

describe("COUNTRY ROUTES", () => {
  // GET A COUNTRY -------------------------------------------

  describe("GET /api/countries/:name", () => {
    describe("given the country does not exist", () => {
      it("should return a 404 error", async () => {
        // Arrange
        const countryName = "invalid-name";
        jest.spyOn(countryService, "findByName").mockResolvedValueOnce(null);

        // Act
        const { statusCode } = await supertest(app).get(
          `/api/countries/${countryName}`
        );

        // Assert
        expect(statusCode).toBe(StatusCodes.NOT_FOUND);
      });
    });

    describe("given the country exists", () => {
      it("should return the country and a 200 status", async () => {
        // Arrange
        const countryName = "portugal";
        jest
          .spyOn(countryService, "findByName")
          .mockResolvedValueOnce(countryPayload);

        // Act
        const { statusCode, body } = await supertest(app).get(
          `/api/countries/${countryName}`
        );

        // Assert
        expect(statusCode).toBe(StatusCodes.OK);
        expect(body).toEqual(countryPayload);
      });
    });
  });

  // CREATE A COUNTRY --------------------------------------

  describe("POST /api/countries", () => {
    describe("given the user is not authenticated", () => {
      it("should return a 401 error", async () => {
        // Act
        const response = await supertest(app).post("/api/countries");

        // Assert
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toEqual({
          statusCode: StatusCodes.UNAUTHORIZED,
          codeName: AppErrorCode.UNAUTHORIZED,
          message: "You must be authenticated to access this route",
          isOperational: true,
        });
      });
    });

    describe("given the user is authenticated", () => {
      describe("but lacks permissions", () => {
        it("should return a 403 error", async () => {
          // Act
          const response = await authenticatedRequest(
            supertest(app).post("/api/countries")
          );

          // Assert
          expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          expect(response.body).toEqual({
            statusCode: StatusCodes.FORBIDDEN,
            codeName: AppErrorCode.FORBIDDEN,
            message: "You do not have permission to access this resource",
            isOperational: true,
          });
        });
      });

      describe("and the country name is already in use", () => {
        it("should return a 409 error", async () => {
          jest
            .spyOn(countryService, "findByName")
            .mockResolvedValueOnce(newCountryPayload);

          // Act
          const { statusCode, body } = await authenticatedRequest(
            supertest(app).post("/api/countries")
          ).send(newCountryPayload);

          // Assert
          expect(statusCode).toBe(StatusCodes.CONFLICT);
          expect(body).toEqual({
            statusCode: StatusCodes.CONFLICT,
            codeName: AppErrorCode.COUNTRY_NAME_IN_USE,
            message: "Country name is already in use",
            isOperational: true,
          });
        });
      });

      describe("and does not send required fields", () => {
        it("should return a 400 error", async () => {
          // Arrange
          jest.spyOn(countryService, "findByName").mockResolvedValueOnce(null);

          // Act
          const { statusCode, body } = await authenticatedRequest(
            supertest(app).post("/api/countries")
          ).send(newCountryPayloadWithoutRequiredFields);

          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual({
            statusCode: StatusCodes.BAD_REQUEST,
            codeName: AppErrorCode.VALIDATION_FAILED,
            message: "Validation failed",
            errors: [
              {
                code: "invalid_type",
                message: "Name is required",
                path: "body.name",
              },
              {
                code: "invalid_type",
                message: "FlagImage URL is required",
                path: "body.flagImage",
              },
              {
                code: "invalid_type",
                message: "JoinedOn is required",
                path: "body.joinedOn",
              },
            ],
            isOperational: true,
          });
        });
      });

      describe("and sends an invalid name, image, and date format", () => {
        it("should return a 400 error", async () => {
          jest.spyOn(countryService, "findByName").mockResolvedValueOnce(null);

          // Act
          const { statusCode, body } = await authenticatedRequest(
            supertest(app).post("/api/countries")
          ).send(newCountryPayloadWithInvalidFields);

          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual({
            statusCode: StatusCodes.BAD_REQUEST,
            codeName: AppErrorCode.VALIDATION_FAILED,
            message: "Validation failed",
            errors: [
              {
                code: "too_small",
                message: "Name cannot be empty",
                path: "body.name",
              },
              {
                code: "invalid_string",
                message: "FlagImage must be a valid URL",
                path: "body.flagImage",
              },
              {
                code: "invalid_string",
                message: "JoinedOn must be a valid date format",
                path: "body.joinedOn",
              },
            ],
            isOperational: true,
          });
        });
      });

      // TODO: Implement tests for image mimetype and size as per your application logic

      describe("and creation is successful", () => {
        it("should return the country and a 201 status", async () => {
          jest.spyOn(countryService, "findByName").mockResolvedValueOnce(null);
          jest
            .spyOn(countryService, "create")
            .mockResolvedValueOnce(countryPayload);

          // Act
          const { statusCode, body } = await authenticatedRequest(
            supertest(app).post("/api/countries")
          ).send(newCountryPayload);

          // Assert
          expect(statusCode).toBe(StatusCodes.CREATED);
          expect(body).toEqual(countryPayload);
        });
      });
    });
  });

  // UPDATE A COUNTRY --------------------------------------

  describe("PATCH /api/countries/:name", () => {
    describe("given the user is not authenticated", () => {
      it("should return a 401 error", async () => {
        // Act
        const response = await supertest(app).patch("/api/countries/portugal");

        // Assert
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toEqual({
          statusCode: StatusCodes.UNAUTHORIZED,
          codeName: AppErrorCode.UNAUTHORIZED,
          message: "You must be authenticated to access this route",
          isOperational: true,
        });
      });
    });

    describe("given the user is authenticated", () => {
      describe("but lacks permissions", () => {
        it("should return a 403 error", async () => {
          // Act
          const response = await authenticatedRequest(
            supertest(app).patch("/api/countries/portugal")
          );

          // Assert
          expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          expect(response.body).toEqual({
            statusCode: StatusCodes.FORBIDDEN,
            codeName: AppErrorCode.FORBIDDEN,
            message: "You do not have permission to access this resource",
            isOperational: true,
          });
        });
      });

      describe("and the country does not exist", () => {
        it("should return a 404 error", async () => {
          jest.spyOn(countryService, "findByName").mockResolvedValueOnce(null);

          // Act
          const response = await authenticatedRequest(
            supertest(app).patch("/api/countries/invalid-name")
          );

          // Assert
          expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
          expect(response.body).toEqual({
            statusCode: StatusCodes.NOT_FOUND,
            codeName: AppErrorCode.COUNTRY_NOT_FOUND,
            message: "Country not found",
            isOperational: true,
          });
        });
      });

      // TODO: Implement tests for image mimetype and size as per your application logic

      describe("and update is successful", () => {
        it("should return the updated country and a 200 status", async () => {
          jest
            .spyOn(countryService, "findByName")
            .mockResolvedValueOnce(countryPayload);
          jest
            .spyOn(countryService, "findAndUpdate")
            .mockResolvedValueOnce(countryPayload);

          // Act
          const { statusCode, body } = await authenticatedRequest(
            supertest(app).patch("/api/countries/portugal")
          ).send({ name: "new-portugal" });

          // Assert
          expect(statusCode).toBe(StatusCodes.OK);
          expect(body).toEqual(countryPayload);
        });
      });
    });
  });

  // DELETE A COUNTRY --------------------------------------

  describe("DELETE /api/countries/:name", () => {
    describe("given the user is not authenticated", () => {
      it("should return a 401 error", async () => {
        // Act
        const response = await supertest(app).delete("/api/countries/portugal");

        // Assert
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toEqual({
          statusCode: StatusCodes.UNAUTHORIZED,
          codeName: AppErrorCode.UNAUTHORIZED,
          message: "You must be authenticated to access this route",
          isOperational: true,
        });
      });
    });

    describe("given the user is authenticated", () => {
      describe("but lacks permissions", () => {
        it("should return a 403 error", async () => {
          // Act
          const response = await authenticatedRequest(
            supertest(app).delete("/api/countries/portugal")
          );

          // Assert
          expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          expect(response.body).toEqual({
            statusCode: StatusCodes.FORBIDDEN,
            codeName: AppErrorCode.FORBIDDEN,
            message: "You do not have permission to access this resource",
            isOperational: true,
          });
        });
      });

      describe("and the country does not exist", () => {
        it("should return a 404 error", async () => {
          jest.spyOn(countryService, "findByName").mockResolvedValueOnce(null);

          // Act
          const response = await authenticatedRequest(
            supertest(app).delete("/api/countries/invalid-name")
          );

          // Assert
          expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
          expect(response.body).toEqual({
            statusCode: StatusCodes.NOT_FOUND,
            codeName: AppErrorCode.COUNTRY_NOT_FOUND,
            message: "Country not found",
            isOperational: true,
          });
        });
      });

      describe("and deletion is successful", () => {
        it("should return a 204 status", async () => {
          jest
            .spyOn(countryService, "findByName")
            .mockResolvedValueOnce(countryPayload);
          jest.spyOn(countryService, "delete");

          // Act
          const { statusCode } = await authenticatedRequest(
            supertest(app).delete("/api/countries/portugal")
          );

          // Assert
          expect(statusCode).toBe(StatusCodes.NO_CONTENT);
        });
      });
    });
  });
});
 */
