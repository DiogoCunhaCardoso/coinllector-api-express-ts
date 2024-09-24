import { Router } from "express";
import validate from "../middleware/validateResource.middleware";
import { requireUser } from "../middleware/requireUser.middleware";
import { loginRateLimiter } from "../utils/ratelimiter";
import { createSessionSchema } from "../schema/session.schema";
import {
  createUserSessionHandler,
  deleteUserSessionHandler,
  getUserSessionsHandler,
  googleOauthSessionHandler,
} from "../controller/session.controller";

// prefix - /api/sessions
const router = Router();

// CREATE ---------------------------------------------------------------
/**
 * @openapi
 * /api/sessions:
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
  "/",
  loginRateLimiter,
  validate(createSessionSchema),
  createUserSessionHandler
);

// GET ALL --------------------------------------------------------------
/**
 * @openapi
 * /api/sessions:
 *   get:
 *     tags:
 *       - Session
 *     summary: Gets user sessions
 *     description: Retrieves all valid sessions for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of user sessions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionId:
 *                     type: string
 *                     description: The session ID.
 *                   userAgent:
 *                     type: string
 *                     description: The user agent string.
 *                   valid:
 *                     type: boolean
 *                     description: Indicates if the session is valid.
 *       401:
 *         description: Unauthorized (user not authenticated).
 */
router.get("/", requireUser, getUserSessionsHandler);

// Google OAUTH ---------------------------------------------------------
/**
 * @openapi
 * /api/sessions/oauth/google:
 *   get:
 *     tags:
 *       - Session
 *     summary: Creates a session using Google OAuth
 *     description: Authenticates the user via Google and creates a session with tokens.
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: The authorization code received from Google.
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to the origin after successful authentication.
 *       400:
 *         description: Missing Google OAuth code.
 *       403:
 *         description: Google account is not verified.
 */
router.get("/oauth/google", googleOauthSessionHandler);

// DELETE ---------------------------------------------------------------
/**
 * @openapi
 * /api/sessions:
 *   delete:
 *     tags:
 *       - Session
 *     summary: Deletes the user session
 *     description: Marks the current session as invalid.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Session deleted successfully.
 *       401:
 *         description: Unauthorized (user not authenticated).
 */
router.delete("/", requireUser, deleteUserSessionHandler);

export default router;
