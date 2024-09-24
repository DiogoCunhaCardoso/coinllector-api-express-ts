/* 


FOR THIS TESTS TO WORK, PLASE COMMENT THE REQUIREUSER AND REQUIREPERMISSIONS ON THE COINS ROUTE


*/

import supertest from "supertest";
import { coinService } from "../service/coin.service";
import { createServer } from "../utils/server";
import { StatusCodes } from "http-status-codes";
import {
  countryNotFoundError,
  invalidCountryName,
  validCountryId,
  validCountryName,
} from "./__fixtures__/country.fixture";
import {
  coinNotFoundError,
  createCoin,
  invalidCoinId,
  invalidCountryNamePatchCoin,
  invalidEnumCoin,
  invalidEnumCoindError,
  invalidEnumPatchCoin,
  invalidPeriodCoin,
  invalidPeriodCoinError,
  invalidQuantityCoin,
  invalidQuantityPatchCoin,
  invalidQuantityWithTypeCoin,
  invalidQuantityWithTypeCoinError,
  invalidQuantityWithTypePatchCoin,
  negativeQuantityCoindError,
  noQuantityWithTypePatchCoin,
  noQuantityWithValidTypeCoin,
  noRequiredFieldsCoin,
  noRequiredFieldsCoinError,
  validCoin,
  validCoinId,
  validPatchCoin,
} from "./__fixtures__/coin.fixture";
import {
  fileTooLongError,
  forbiddenError,
  unauthorizedError,
  unsopportedFileTypeError,
} from "./__fixtures__/global.fixture";
import { countryService } from "../service/country.service";

const app = createServer();

describe("COIN ROUTES", () => {
  // CREATE A COIN ------------------------------------------------
  describe("Create a coin - POST /api/countries/:countryName/coins", () => {
    /* describe("given the user is not authenticated", () => {
      it("should return 401 Unauthorized JSON", async () => {
        // Act
        const { statusCode, body } = await supertest(app).post(
          `/api/countries/${validCountryName}/coins`
        );
        // Assert
        expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(body).toEqual(unauthorizedError);
      });
    }); */
    describe("given the user is authenticated", () => {
      /* describe("and has invalid permissions", () => {
        it("should return 403 Forbidden JSON", async () => {
          // Act
          const { statusCode, body } = await supertest(app).post(
            `/api/countries/${validCountryName}/coins`
          );
          // Assert
          expect(statusCode).toBe(StatusCodes.FORBIDDEN);
          expect(body).toEqual(forbiddenError);
        });
      }); */
      describe("and the associated country does not exist", () => {
        it("should return 404 Not Found JSON", async () => {
          // Arrange
          jest.spyOn(countryService, "findByName").mockResolvedValueOnce(null);
          // Act
          const { statusCode, body } = await supertest(app)
            .post(`/api/countries/${invalidCountryName}/coins`)
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
            .post(`/api/countries/${validCountryName}/coins`)
            .send(noRequiredFieldsCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(noRequiredFieldsCoinError);
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
            .post(`/api/countries/${validCountryName}/coins`)
            .send(invalidEnumCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(invalidEnumCoindError);
        });
      });
      describe("and the coin quantity is negative", () => {
        it("should return 400 Bad Request JSON", async () => {
          // Arrange
          jest
            .spyOn(coinService, "create")
            .mockResolvedValueOnce(invalidQuantityCoin);
          // Act
          const { statusCode, body } = await supertest(app)
            .post(`/api/countries/${validCountryName}/coins`)
            .send(invalidQuantityCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(negativeQuantityCoindError);
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
            .post(`/api/countries/${validCountryName}/coins`)
            .send(invalidQuantityWithTypeCoin);

          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(invalidQuantityWithTypeCoinError);
        });
      });
      describe("and no quantity is given while the coin type is commemorative", () => {
        it("should return 400 Bad Request JSON", async () => {
          // Arrange
          jest
            .spyOn(coinService, "create")
            .mockResolvedValueOnce(noQuantityWithValidTypeCoin);

          // Act
          const { statusCode, body } = await supertest(app)
            .post(`/api/countries/${validCountryName}/coins`)
            .send(noQuantityWithValidTypeCoin);

          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(invalidQuantityWithTypeCoinError);
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
            .post(`/api/countries/${validCountryName}/coins`)
            .send(invalidPeriodCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(invalidPeriodCoinError);
        });
      });
      /* describe("and the image is of invalid mimetype", () => {
        it("should return 415 Unsupported Media Type JSON", async () => {
          // Arrange
          jest
            .spyOn(coinService, "create")
            .mockResolvedValueOnce(unsopportedFileTypeError);
          // Act
          const { statusCode, body } = await supertest(app).post(
            `/api/countries/${validCountryName}/coins`
          );
          // Assert
          expect(statusCode).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
          expect(body).toEqual(unsopportedFileTypeError);
        });
      }); */
      /* describe("and the image is too big", () => {
        it("should return 413 Payload Too Large JSON", async () => {
          // Arrange
          jest.spyOn(coinService, "create").mockResolvedValueOnce(null); 

          // Act
          const { statusCode, body } = await supertest(app).post(
            `/api/countries/${validCountryName}/coins`
          );

          // Assert
          expect(statusCode).toBe(StatusCodes.REQUEST_TOO_LONG);
          expect(body).toEqual(fileTooLongError);
        });
      }); */
      describe("and the coin is created", () => {
        it("should return 201 Created and the newly created coin", async () => {
          //Arrange
          jest
            .spyOn(countryService, "findByName")
            .mockResolvedValueOnce({ _id: validCountryId });
          jest.spyOn(coinService, "create").mockResolvedValueOnce({
            ...validCoin,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
          // Act
          const { statusCode, body } = await supertest(app)
            .post(`/api/countries/${validCountryName}/coins`)
            .send(validCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.CREATED);
          expect(body).toEqual({
            ...validCoin,
            country: validCountryId,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });
      });
    });
  });

  // UPDATE A COIN ------------------------------------------------
  describe("Update a coin by ID - PATCH /api/coins/:id", () => {
    /* describe("given the user is not authenticated", () => {
      it("should return 401 Unauthorized JSON", async () => {
        // Act
        const { statusCode, body } = await supertest(app).patch(
          `/api/countries/${validCountryName}/coins`
        );
        // Assert
        expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(body).toEqual(unauthorizedError);
      });
    }); */
    describe("given the user is authenticated", () => {
      /* describe("and has invalid permissions", () => {
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
      }); */
      describe("and the new associated country does not exist", () => {
        it("should return 404 Not Found JSON", async () => {
          // Arrange
          jest.spyOn(countryService, "findByName").mockResolvedValueOnce(null);
          jest
            .spyOn(coinService, "findAndUpdate")
            .mockResolvedValueOnce(validCoin);
          // Act
          const { statusCode, body } = await supertest(app)
            .patch(`/api/coins/${validCoinId}`)
            .send(invalidCountryNamePatchCoin);

          // Assert
          expect(statusCode).toBe(StatusCodes.NOT_FOUND);
          expect(body).toEqual(countryNotFoundError);
        });
      });
      describe("and the coin does not exist", () => {
        it("should return 404 Not Found JSON", async () => {
          // Arrange
          jest.spyOn(coinService, "findAndUpdate").mockResolvedValueOnce(null);
          // Act
          const { statusCode, body } = await supertest(app)
            .patch(`/api/coins/${invalidCoinId}`)
            .send(validPatchCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.NOT_FOUND);
          expect(body).toEqual(coinNotFoundError);
        });
      });
      describe("and the new coin type is not of valid enum", () => {
        it("should return 400 Bad Request JSON", async () => {
          // Arrange
          jest
            .spyOn(coinService, "findAndUpdate")
            .mockResolvedValueOnce(invalidEnumPatchCoin);
          // Act
          const { statusCode, body } = await supertest(app)
            .patch(`/api/coins/${validCoinId}`)
            .send(invalidEnumPatchCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(invalidEnumCoindError);
        });
      });
      describe("and the coin quantity is negative", () => {
        it("should return 400 Bad Request JSON", async () => {
          // Arrange
          jest
            .spyOn(coinService, "findAndUpdate")
            .mockResolvedValueOnce(invalidQuantityPatchCoin);
          // Act
          const { statusCode, body } = await supertest(app)
            .patch(`/api/coins/${validCoinId}`)
            .send(invalidQuantityPatchCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(negativeQuantityCoindError);
        });
      });
      describe("and the coin quantity is given without coin type being commemorative", () => {
        it("should return 400 Bad Request JSON", async () => {
          // Arrange
          jest
            .spyOn(coinService, "findAndUpdate")
            .mockResolvedValueOnce(invalidQuantityWithTypeCoin);
          // Act
          const { statusCode, body } = await supertest(app)
            .patch(`/api/coins/${validCoinId}`)
            .send(invalidQuantityWithTypeCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(invalidQuantityWithTypeCoinError);
        });
      });
      describe("and the new period end date is before period start date", () => {
        it("should return 400 Bad Request JSON", async () => {
          // Arrange
          jest
            .spyOn(coinService, "findAndUpdate")
            .mockResolvedValueOnce(invalidPeriodCoin);
          // Act
          const { statusCode, body } = await supertest(app)
            .patch(`/api/coins/${validCoinId}`)
            .send(invalidPeriodCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual(invalidPeriodCoinError);
        });
      });
      /* describe("and the new image is of invalid mimetype", () => {
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
      }); */
      /* describe("and the new image is too big", () => {
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
      }); */
      describe("and the coin is updated", () => {
        it("should return 200 Success and the updated coin", async () => {
          // Arrange
          jest.spyOn(coinService, "findAndUpdate").mockResolvedValueOnce({
            validPatchCoin,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
          // Act
          const { statusCode, body } = await supertest(app)
            .patch(`/api/coins/${validCoinId}`)
            .send(validPatchCoin);
          // Assert
          expect(statusCode).toBe(StatusCodes.OK);
          expect(body).toEqual({
            validPatchCoin,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });
      });
    });
  });

  // GET ALL COINS ----------------------------------------
  describe("Get all coins - GET /api/coins", () => {
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
  describe("Get a coin by ID - GET /api/coins/:id", () => {
    describe("given the coin does not exist", () => {
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
        //@ts-ignore
        jest.spyOn(coinService, "findById").mockResolvedValueOnce(validCoin);

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
  describe("Delete a coin by ID - DELETE /api/coins/:id", () => {
    /* describe("given the user is not authenticated", () => {
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
    }), */
    describe("given the user is authenticated", () => {
      /*     describe("and has invalid permissions", () => {
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
        }); */
      describe("and the coin does not exist", () => {
        it("should return a 204 No Content", async () => {
          // Arrange
          //@ts-ignore
          jest.spyOn(coinService, "delete").mockResolvedValueOnce({});
          // Act
          const { statusCode, body } = await supertest(app).delete(
            `/api/coins/${invalidCoinId}`
          );
          // Assert
          expect(statusCode).toBe(StatusCodes.NO_CONTENT);
          expect(body).toEqual({});
        });
      });
      describe("and the coin does exist", () => {
        it("should return 204 No Content", async () => {
          // Arrange
          //@ts-ignore
          jest.spyOn(coinService, "delete").mockResolvedValueOnce({});
          // Act
          const { statusCode, body } = await supertest(app).delete(
            `/api/coins/${validCoinId}`
          );
          // Assert
          expect(statusCode).toBe(StatusCodes.NO_CONTENT);
          expect(body).toEqual({});
        });
      });
    });
  });
});
