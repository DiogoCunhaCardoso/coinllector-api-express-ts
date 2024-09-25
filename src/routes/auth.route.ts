import { Router } from "express";
import {
  loginUserHandler,
  logoutUserHandler,
  registerUserHandler,
  resetPasswordHandler,
  sendPasswordResetEmail,
  verifyUserEmailHandler,
} from "../controller/auth.controller";
import validate from "../middleware/validateResource.middleware";
import {
  createUserSchema,
  resetPasswordSchema,
  sendResetPasswordEmailSchema,
  verifyUserEmailSchema,
} from "../schema";
import { loginRateLimiter } from "../utils/ratelimiter";
import { loginSchema } from "../schema/session.schema";

// prefix - /api/auth
const router = Router();

// REGISTER -------------------------------------------------------------
/**
 * @openapi
 * '/api/users':
 *  post:
 *     tags:
 *     - User
 *     summary: Registers a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post("/register", validate(createUserSchema), registerUserHandler);

// VERIFY EMAIL ---------------------------------------------------------
router.post(
  "/verify/:code",
  validate(verifyUserEmailSchema),
  verifyUserEmailHandler
);

// LOGIN ---------------------------------------------------------------
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Session
 *     summary: Creates a user session
 *     description: Authenticates the user and creates a new session with access and refresh tokens (they are set on cookies).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Session created successfully, returns access and refresh tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token.
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token.
 *       403:
 *         description: Invalid credentials or email not verified.
 *       400:
 *         description: Bad request (validation errors).
 */
router.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  loginUserHandler
);

// RESET PASSWORD EMAIL -------------------------------------------------
/**
 * @openapi
 * /api/auth/password/forgot:
 *   post:
 *     tags:
 *       - User
 *     summary: Sends email with code to reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       '200':
 *         description: Email sent
 *       '404':
 *         description: User not found
 */
router.post(
  "/password/forgot",
  validate(sendResetPasswordEmailSchema),
  sendPasswordResetEmail
);

// RESET PASSWORD -------------------------------------------------------
/**
 * @openapi
 * /api/password/reset:
 *   post:
 *     tags:
 *       - User
 *     summary: Resets password with OTP
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: passwordResetCode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       '200':
 *         description: Password reset successful
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: User not found
 */
router.post(
  "/password/reset",
  validate(resetPasswordSchema),
  resetPasswordHandler
);

// LOGOUT ---------------------------------------------------------------
router.get("/logout", logoutUserHandler);

export default router;
