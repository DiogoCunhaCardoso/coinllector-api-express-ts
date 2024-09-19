import { Router } from "express";
import validate from "../middleware/validateResource.middleware";
import { requireUser } from "../middleware/requireUser.middleware";
import { recoverPasswordRateLimiter } from "../utils/ratelimiter";
import upload from "../middleware/multer";
import {
  addCoinToUserSchema,
  createUserSchema,
  forgotPasswordSchema,
  removeCoinFromUserSchema,
  resetPasswordSchema,
  verifyUserEmailSchema,
} from "../schema";
import {
  addCoinToUserHandler,
  createUserHandler,
  deleteCurrentUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  removeCoinFromUserHandler,
  resetPasswordHandler,
  uploadProfilePictureHandler,
  verifyUserEmailHandler,
} from "../controller";

const router = Router();

// CREATE ---------------------------------------------------------------
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

router.post("/", validate(createUserSchema), createUserHandler);

// VERIFY EMAIL ---------------------------------------------------------
/**
 * @openapi
 * /api/users/verify/{id}/{verificationCode}:
 *   post:
 *     tags:
 *       - User
 *     summary: Verifies email with OTP sent via email
 */

router.post(
  "/verify/:id/:verificationCode",
  validate(verifyUserEmailSchema),
  verifyUserEmailHandler
);

// FORGOT PASSWORD EMAIL ------------------------------------------------
/**
 * @openapi
 * /api/users/forgot-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Sends email with OTP code to reset password
 */

router.post(
  "/forgot-password",
  recoverPasswordRateLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordHandler
);

// RESET PASSWORD -------------------------------------------------------
/**
 * @openapi
 * /api/users/reset-password/{id}/{passwordResetCode}:
 *   post:
 *     tags:
 *       - User
 *     summary: Resets password with OTP
 */

router.post(
  "/reset-password/:id/:passwordResetCode",
  validate(resetPasswordSchema),
  resetPasswordHandler
);

//TODO not checked if it is correct
// ADD/UPDATE PFP -------------------------------------------------------
/**
 * @openapi
 * /api/users/me/pfp:
 *   put:
 *     tags:
 *       - User
 *     summary: Creates or replaces a profile picture
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pfp:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture to upload
 *     responses:
 *       '200':
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user ID
 *                 profilePicture:
 *                   type: string
 *                   description: URL of the updated profile picture
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized, authentication required
 *       '404':
 *         description: User not found
 */

router.put(
  "/me/pfp",
  requireUser,
  upload.single("pfp"),
  uploadProfilePictureHandler
);

// GET LOGGED USER (ME) -------------------------------------------------

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Gets logged user
 *     security:
 *       - BearerAuth: []
 *
 */
router.get("/me", requireUser, getCurrentUserHandler);

// DELETE LOGGED USER (ME) ----------------------------------------------
/**
 * @openapi
 * /api/users/me:
 *   delete:
 *     tags:
 *       - User
 *     summary: Soft deletes logged user's account
 *     security:
 *       - BearerAuth: []
 */

router.delete("/me", requireUser, deleteCurrentUserHandler);
//TODO RN deletes, not soft deletes.

// ADD COIN (ME) --------------------------------------------------------
/**
 * @openapi
 * /api/users/me/coins:
 *   post:
 *     tags:
 *       - User
 *     summary: Adds a coin to the logged user's coins collection
 *     security:
 *       - BearerAuth: []
 */

router.post(
  "/me/coins",
  requireUser,
  validate(addCoinToUserSchema),
  addCoinToUserHandler
);

// REMOVE COIN (ME) -----------------------------------------------------
/**
 * @openapi
 * /api/users/me/coins:
 *   delete:
 *     tags:
 *       - User
 *     summary: Removes a coin from the logged user's coins collection
 *     security:
 *       - BearerAuth: []
 */

router.delete(
  "/me/coins",
  requireUser,
  validate(removeCoinFromUserSchema),
  removeCoinFromUserHandler
);

// GET ALL --------------------------------------------------------------
// GET BY ID ------------------------------------------------------------
// DELETE ---------------------------------------------------------------

export default router;

// TODO - change to softDelete:true and a timer.
// change-to-paid (check after better routing convention)
