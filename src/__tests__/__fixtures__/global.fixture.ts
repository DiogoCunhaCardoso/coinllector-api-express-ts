import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../../constants/appErrorCode";
import supertest from "supertest";

export const unauthorizedError = {
  statusCode: StatusCodes.UNAUTHORIZED,
  codeName: AppErrorCode.UNAUTHORIZED,
  message: "You must be authenticated to access this route",
  isOperational: true,
};

export const forbiddenError = {
  statusCode: StatusCodes.FORBIDDEN,
  codeName: AppErrorCode.FORBIDDEN,
  message: "You are not allowed to access this route",
  isOperational: true,
};

export const unsopportedFileTypeError = {
  statusCode: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
  codeName: AppErrorCode.INVALID_FILE_TYPE,
  message: "Invalid file type",
  errors: [
    {
      code: expect.any(String),
      message: expect.any(String),
      path: expect.any(String),
    },
  ],
  isOperational: true,
};

export const fileTooLongError = {
  statusCode: StatusCodes.REQUEST_TOO_LONG,
  codeName: AppErrorCode.FILE_TOO_BIG,
  message: "File is too big. Max is 2mb",
  errors: [
    {
      code: expect.any(String),
      message: expect.any(String),
      path: expect.any(String),
    },
  ],
  isOperational: true,
};

// HELPER FUNCTIONS ---------------------------------------------

export const authenticatedRequest = (request: supertest.Test) =>
  request
    .set("Authorization", `Bearer ${"adminAccessToken"}`)
    .set("x-refresh", "adminRefreshToken");

const adminAccessToken: string =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmViMTU1NTNkZmEwM2IyYzVjOGNmYjMiLCJuYW1lIjoiQWRtaW4gVGVzdCIsImVtYWlsIjoiYWRtaW4tdGVzdEB0ZXN0LmNvbSIsImNvaW5zIjpbXSwiY3JlYXRlZEF0IjoiMjAyNC0wOS0xOFQxODowMDo1My41MDBaIiwidXBkYXRlZEF0IjoiMjAyNC0wOS0xOFQxODowMDo1My41MDBaIiwic2NvcGVzIjpbImNvaW5zOndyaXRlIiwiY29pbnM6cmVhZCIsImNvaW5zOnVwZGF0ZSIsImNvaW5zOmRlbGV0ZSIsImNvaW5zOnJhdGUtcXVhbGl0eSIsImNvdW50cmllczp3cml0ZSIsImNvdW50cmllczpyZWFkIiwiY291bnRyaWVzOnVwZGF0ZSIsImNvdW50cmllczpkZWxldGUiXSwic2Vzc2lvbiI6IjY2ZWIyYWViYmQyNzZiNjM0NTZiNTZhNSIsImlhdCI6MTcyNjY4Nzk3OSwiZXhwIjoxNzI2Njg4ODc5fQ.r1etBLUqPxYic9dXmpwIBhj9Ho867gLRNLGqeefDxbgvx-rFt0RSdsZKFvoNChm90-fOetPcJIkv1-k0erjja-HwC0UNihXNu7o7OdpqDDOeE8n7lvogOqAyZKfs7dGezqzKyUl25ZlsUwVvo78m0jKeO4un6jqCj6OTHMQgq5OKLEdkaaCIJh6AAWsKkBPvcodFhiXx4ZjdTdWeoRspZL88-RUC1tmQ6E_UJMn25HraIaubvqgGnIadQzWfJbf0axdkOrgjlCT5_CxEIw_66DZ6168Y7_I9JGR1AjIxSV50BPicPXUW8KdiTF-UfgvofLY-D8hQs1Db_vV2oPsAqQ";
const adminRefreshToken: string =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmViMTU1NTNkZmEwM2IyYzVjOGNmYjMiLCJuYW1lIjoiQWRtaW4gVGVzdCIsImVtYWlsIjoiYWRtaW4tdGVzdEB0ZXN0LmNvbSIsImNvaW5zIjpbXSwiY3JlYXRlZEF0IjoiMjAyNC0wOS0xOFQxODowMDo1My41MDBaIiwidXBkYXRlZEF0IjoiMjAyNC0wOS0xOFQxODowMDo1My41MDBaIiwic2NvcGVzIjpbImNvaW5zOndyaXRlIiwiY29pbnM6cmVhZCIsImNvaW5zOnVwZGF0ZSIsImNvaW5zOmRlbGV0ZSIsImNvaW5zOnJhdGUtcXVhbGl0eSIsImNvdW50cmllczp3cml0ZSIsImNvdW50cmllczpyZWFkIiwiY291bnRyaWVzOnVwZGF0ZSIsImNvdW50cmllczpkZWxldGUiXSwic2Vzc2lvbiI6IjY2ZWIyYWViYmQyNzZiNjM0NTZiNTZhNSIsImlhdCI6MTcyNjY4Nzk3OSwiZXhwIjoxNzU4MjQ1NTc5fQ.RX8pP6W0GBQHjZGcdnYjyR1S85ip8fDAHaxMMst8ye5uFCTPrCGF50cg4fZ07WE80YQ7M_NZvLMTAFreo39_9bxv-6qpnnOszmny4lLzG-5vUBZe_-r938ZdpAZKcrb4yXXWMGOiPzyvpzATDdOVI2eYUKAG-MMMjHC4qYsuBwKfTUo_UpruFXKLC7BH5THo87tEIZOXCuYi-02NLrFBoyatxCTxDrsQGvFYb87MOWoNkgjQa2cL8HLVClXP47hRciA9ntsjNVcj5j7ZUoP7hgzecjuoKrllIJZGex0P3LGvEjrSqtVZI6Yb27FPE9inEXkx2-hJEySW42_Q_gqfRg";
