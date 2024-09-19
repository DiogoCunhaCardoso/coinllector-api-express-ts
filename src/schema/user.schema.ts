import mongoose from "mongoose";
import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        name:
 *          type: string
 *          example: John Doe
 *        email:
 *          type: string
 *          example: john.doe@example.com
 *        password:
 *          type: string
 *          example: strongPassword123
 *        passwordConfirmation:
 *          type: string
 *          example: strongPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        _id:
 *          type: string
 *        createAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

const payloadSchema = object({
  name: string({ required_error: "Name is required" }),
  password: string({ required_error: "Passwords is required" }).min(
    6,
    "Password to short - should be 6 chars minimum"
  ),
  passwordConfirmation: string({
    required_error: "PasswordConfirmation is required",
  }),
  email: string({ required_error: "Email is required" }).email(
    "Not a valid email"
  ),

  // C H E C K _ I F _ P A S S W O R D S _ M A T C H
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

const payloadCoinManagementSchema = object({
  coinId: string({
    required_error: "Coin ID is required",
  }),
});

export const createUserSchema = object({
  body: payloadSchema,
});

export const addCoinToUserSchema = object({
  body: payloadCoinManagementSchema,
});

export const removeCoinFromUserSchema = object({
  body: payloadCoinManagementSchema,
});

export const verifyUserEmailSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({ required_error: "Passwords is required" }).min(
      6,
      "Password to short - should be 6 chars minimum"
    ),
    passwordConfirmation: string({
      required_error: "PasswordConfirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
//
export type AddCoinToUserInput = TypeOf<typeof addCoinToUserSchema>;
export type RemoveCoinFromUserInput = TypeOf<typeof removeCoinFromUserSchema>;

export type VerifyUserEmailInput = TypeOf<typeof verifyUserEmailSchema>;
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
