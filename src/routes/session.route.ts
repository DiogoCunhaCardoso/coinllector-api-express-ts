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

const router = Router();

// CREATE ---------------------------------------------------------------
/**
 * @openapi
 * /api/sessions:
 *   post:
 *     tags:
 *       - Session
 *     summary: Creates a session
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
 *     summary: Gets a session
 *     security:
 *       - BearerAuth: []
 */
router.get("/", requireUser, getUserSessionsHandler);

// Google OAUTH ---------------------------------------------------------
/**
 * @openapi
 * /api/sessions/oauth/google:
 *   post:
 *     tags:
 *       - Session
 *     summary: Creates a session using Google Oauth
 */
router.get("/oauth/google", googleOauthSessionHandler);

// DELETE ---------------------------------------------------------------
/**
 * @openapi
 * /api/sessions:
 *   delete:
 *     tags:
 *       - Session
 *     summary: Sets session valid flag false
 *     security:
 *       - BearerAuth: []
 */
router.delete("/", requireUser, deleteUserSessionHandler);

export default router;
