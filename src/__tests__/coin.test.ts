import supertest from "supertest";
import { createServer } from "http";
import { coinService } from "../service/coin.service";
import { StatusCodes } from "http-status-codes";
import {
  validCoin,
  validCoinId,
  invalidCoinId,
  coinNotFoundError,
  noRequiredFieldsCoin,
  invalidEnumCoin,
  invalidQuantityCoin,
  invalidQuantityWithTypeCoin,
  invalidPeriodCoin,
  validPatchCoin,
  fileTooLargeError,
} from "./__fixtures__/coin.fixture";
import {
  unauthorizedError,
  forbiddenError,
  validationFailedError,
  unsopportedFileTypeError,
  fileTooLongError,
} from "./__fixtures__/global.fixture";
import {
  countryNotFoundError,
  invalidCountryName,
  validCountryName,
} from "./__fixtures__/country.fixture";

const app = createServer();

describe("COIN ROUTES", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // CREATE A COIN ----------------------------------------
  describe("POST /api/:countryName/coins", () => {
    describe("given the user is not authenticated", () => {
      it("should return 401 Unauthorized JSON", async () => {
        // Arrange
        jest.spyOn(coinService, "create").mockResolvedValueOnce(null); // change to payload
        // Act
        const { statusCode, body } = await supertest(app)
          .post(`/api/${validCountryName}/coins`)
          .send(validCoin);
        // Assert
        expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(body).toEqual(unauthorizedError);
      });
    }),
      describe("given the user is authenticated", () => {
        describe("and has invalid permissions", () => {
          it("should return 403 Forbidden JSON", async () => {
            // Arrange
            jest.spyOn(coinService, "create").mockResolvedValueOnce(validCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .post(`/api/:countryName/coins`)
              .send(validCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.FORBIDDEN);
            expect(body).toEqual(forbiddenError);
          });
        });
        describe("and the associated country does not exist", () => {
          it("should return 404 Not Found JSON", async () => {
            // Arrange
            jest.spyOn(coinService, "create").mockResolvedValueOnce(null); // change to payload
            // Act
            const { statusCode, body } = await supertest(app)
              .post(`/api/${invalidCountryName}/coins`)
              .send(validCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.NOT_FOUND);
            expect(body).toEqual(countryNotFoundError);
          });
        });
        describe("and the required fields are not sent", () => {
          it("should return 400 Bad Request JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "create")
              .mockResolvedValueOnce(noRequiredFieldsCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .post(`/api/${validCountryName}/coins`)
              .send(noRequiredFieldsCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toEqual(validationFailedError);
          });
        });
        describe("and the coin type is not of valid enum", () => {
          it("should return 400 Bad Request JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "create")
              .mockResolvedValueOnce(invalidEnumCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .post(`/api/${validCountryName}/coins`)
              .send(invalidEnumCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toEqual(validationFailedError);
          });
        });
        describe("and the coin quantity is negative", () => {
          it("should return 400 Bad Request JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "create")
              .mockResolvedValueOnce(invalidQuantityCoin); // change to payload
            // Act
            const { statusCode, body } = await supertest(app)
              .post(`/api/${validCountryName}/coins`)
              .send(invalidQuantityCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toEqual(validationFailedError);
          });
        });
        describe("and the coin quantity is given without coin type being commemorative", () => {
          it("should return 400 Bad Request JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "create")
              .mockResolvedValueOnce(invalidQuantityWithTypeCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .post(`/api/${validCountryName}/coins`)
              .send(invalidQuantityWithTypeCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toEqual(validationFailedError);
          });
        });
        describe("and the period end date is before period start date", () => {
          it("should return 400 Bad Request JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "create")
              .mockResolvedValueOnce(invalidPeriodCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .post(`/api/${validCountryName}/coins`)
              .send(invalidPeriodCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toEqual(validationFailedError);
          });
        });
        describe("and the image is of invalid mimetype", () => {
          it("should return 415 Unsupported Media Type JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "create")
              .mockResolvedValueOnce(unsopportedFileTypeError);
            // Act
            const { statusCode, body } = await supertest(app).post(
              `/api/${validCountryName}/coins`
            );
            // Assert
            expect(statusCode).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
            expect(body).toEqual(unsopportedFileTypeError);
          });
        });
        describe("and the image is too big", () => {
          it("should return 413 Payload Too Large JSON", async () => {
            // Arrange
            const validCountryName = "portugal";
            jest.spyOn(coinService, "create").mockResolvedValueOnce(null); // change to payload

            // Act
            const { statusCode, body } = await supertest(app).post(
              `/api/${validCountryName}/coins`
            );

            // Assert
            expect(statusCode).toBe(StatusCodes.REQUEST_TOO_LONG);
            expect(body).toEqual(fileTooLongError);
          });
        });
        describe("and the coin is created", () => {
          it("should return 201 Created and the new coin", async () => {
            // Arrange
            jest.spyOn(coinService, "create").mockResolvedValueOnce(validCoin);
            // Act
            const { statusCode, body } = await supertest(app).post(
              `/api/{/coins`
            );
            // Assert
            expect(statusCode).toBe(StatusCodes.CREATED);
            expect(body).toEqual(validCoin);
          });
        });
      });
  });

  // UPDATE A COIN ----------------------------------------
  describe("PATCH /api/coins/:id", () => {
    describe("given the user is not authenticated", () => {
      it("should return 401 Unauthorized JSON", async () => {
        // Arrange
        jest
          .spyOn(coinService, "findAndUpdate")
          .mockResolvedValueOnce(validPatchCoin);
        // Act
        const { statusCode, body } = await supertest(app)
          .patch(`/api/coins/${validCoinId}`)
          .send(validPatchCoin);
        // Assert
        expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(body).toEqual(unauthorizedError);
      });
    }),
      describe("given the user is authenticated", () => {
        describe("and has invalid permissions", () => {
          it("should return 403 Forbidden JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validPatchCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .patch(`/api/coins/${validCoinId}`)
              .send(validPatchCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.FORBIDDEN);
            expect(body).toEqual(forbiddenError);
          });
        });
        describe("and the coin does not exist", () => {
          it("should return 404 Not Found JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validPatchCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .patch(`/api/coins/${invalidCoinId}`)
              .send(validPatchCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.NOT_FOUND);
            expect(body).toEqual(coinNotFoundError);
          });
        });
        describe("and the new country does not exist", () => {
          it("should return 404 Not Found JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validPatchCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .patch(`/api/coins/${validCoinId}`)
              .send(validPatchCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.NOT_FOUND);
            expect(body).toEqual(countryNotFoundError);
          });
        });
        describe("and the new coin type is not of valid enum", () => {
          it("should return 400 Bad Request JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validPatchCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .patch(`/api/coins/${validCoinId}`)
              .send(validPatchCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toEqual(validationFailedError);
          });
        });
        describe("and the coin quantity is given without coin type being commemorative", () => {
          it("should return 400 Bad Request JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validPatchCoin); // change to payload
            // Act
            const { statusCode, body } = await supertest(app)
              .patch(`/api/coins/${validCoinId}`)
              .send(validPatchCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toEqual(validationFailedError);
          });
        });
        describe("and the new period end date is before period start date", () => {
          it("should return 400 Bad Request JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validPatchCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .patch(`/api/coins/${validCoinId}`)
              .send(validPatchCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toEqual(validationFailedError);
          });
        });
        describe("and the new image is of invalid mimetype", () => {
          it("should return 415 Unsupported Media Type JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validPatchCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .patch(`/api/coins/${validCoinId}`)
              .send(validPatchCoin);
            // Assert
            expect(statusCode).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
            expect(body).toEqual(unsopportedFileTypeError);
          });
        });
        describe("and the new image is too big", () => {
          it("should return 413 Payload Too Large JSON", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validPatchCoin);
            // Act
            const { statusCode, body } = await supertest(app)
              .patch(`/api/coins/${validCoinId}`)
              .send(validPatchCoin);

            // Assert
            expect(statusCode).toBe(StatusCodes.REQUEST_TOO_LONG);
            expect(body).toEqual(fileTooLargeError);
          });
        });
        describe("and the coin is updated", async () => {
          it("should return 201 Created and the new coin", async () => {
            // Arrange
            jest
              .spyOn(coinService, "findAndUpdate")
              .mockResolvedValueOnce(validCoin);
            // Act
            const { statusCode, body } = await supertest(app).patch(
              `/api/coins/${validCoinId}`
            );
            // Assert
            expect(statusCode).toBe(StatusCodes.CREATED);
            expect(body).toEqual(validCoin);
          });
        });
      });
  });

  // GET ALL COINS ----------------------------------------
  describe("GET /api/coins", () => {
    describe("given the coins array does exist", () => {
      it("should return 200 OK and the list of coins", async () => {
        // Arrange
        jest.spyOn(coinService, "find").mockResolvedValueOnce([validCoin]);
        // Act
        const { statusCode, body } = await supertest(app).get(`/api/coins`);
        // Assert
        expect(statusCode).toBe(StatusCodes.OK);
        expect(body).toEqual([validCoin]);
      });
    });
  });

  // GET A COIN BY ID -------------------------------------
  describe("GET /api/coins/:id", () => {
    describe("and the coin does not exist", () => {
      it("should return 404 Not Found JSON", async () => {
        // Arrange
        jest.spyOn(coinService, "findById").mockResolvedValueOnce(null);
        // Act
        const { statusCode, body } = await supertest(app).get(
          `/api/coins/${invalidCoinId}`
        );
        // Assert
        expect(statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(body).toEqual(coinNotFoundError);
      });
    });
    describe("given the coin exists", () => {
      it("should return 200 Success and the coins", async () => {
        // Arrange
        jest.spyOn(coinService, "findById").mockResolvedValueOnce(null);

        // Act
        const { statusCode, body } = await supertest(app).get(
          `/api/coins/${validCoinId}`
        );

        // Assert
        expect(statusCode).toBe(StatusCodes.OK);
        expect(body).toEqual(validCoin);
      });
    });
  });

  // DELETE A COIN ----------------------------------------
  describe("DELETE /api/coins/:id", () => {
    describe("given the user is not authenticated", () => {
      it("should return 401 Unauthorized JSON", async () => {
        // Arrange
        jest.spyOn(coinService, "delete");
        // Act
        const { statusCode, body } = await supertest(app).delete(
          `/api/coins/${validCoinId}`
        );
        // Assert
        expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(body).toEqual(unauthorizedError);
      });
    }),
      describe("given the user is authenticated", () => {
        describe("and has invalid permissions", () => {
          it("should return 403 Forbidden JSON", async () => {
            // Arrange
            jest.spyOn(coinService, "delete");
            // Act
            const { statusCode, body } = await supertest(app).delete(
              `/api/coins/${validCoinId}`
            );
            // Assert
            expect(statusCode).toBe(StatusCodes.FORBIDDEN);
            expect(body).toEqual(forbiddenError);
          });
        });
        describe("and the coin does not exist", () => {
          it("should return 404 Not Found JSON", async () => {
            // Arrange
            jest.spyOn(coinService, "delete");
            // Act
            const { statusCode, body } = await supertest(app).delete(
              `/api/coins/${invalidCoinId}`
            );
            // Assert
            expect(statusCode).toBe(StatusCodes.NOT_FOUND);
            expect(body).toEqual(coinNotFoundError);
          });
        });
        describe("and the coin does exist", () => {
          it("should return 204 No Content", async () => {
            // Arrange
            jest.spyOn(coinService, "delete");
            // Act
            const { statusCode, body } = await supertest(app).delete(
              `/api/coins/${validCoinId}`
            );
            // Assert
            expect(statusCode).toBe(StatusCodes.NO_CONTENT);
            expect(body).toEqual(null);
          });
        });
      });
  });
});
