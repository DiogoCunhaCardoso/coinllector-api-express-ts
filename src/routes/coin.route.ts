import { Router } from "express";
import validate from "../middleware/validateResource.middleware";
import { requireUser } from "../middleware/requireUser.middleware";
import { requirePermission } from "../middleware/requirePermission";
import { PERMISSIONS } from "../constants/permissions";
import {
  createCoinSchema,
  deleteCoinSchema,
  updateCoinSchema,
} from "../schema";
import {
  createCoinHandler,
  updateCoinHandler,
  getCoinByIdHandler,
  getCoinsHandler,
  deleteCoinHandler,
} from "../controller";

const router = Router();

// CREATE ---------------------------------------------------------------
/**
 * @openapi
 * /api/coins:
 *   post:
 *     tags:
 *       - Coin
 *     summary: Creates a coin
 *     security:
 *       - BearerAuth: []
 */

router.post(
  "/:countryName/coins",
  requireUser,
  requirePermission(PERMISSIONS["coins:write"]),
  validate(createCoinSchema),
  createCoinHandler
);

// UPDATE ---------------------------------------------------------------
/**
 * @openapi
 * /api/coins/{id}:
 *   patch:
 *     tags:
 *       - Coin
 *     summary: Updates a coin by ID
 *     security:
 *       - BearerAuth: []
 */

router.patch(
  "/:id",
  requireUser,
  requirePermission(PERMISSIONS["coins:update"]),
  validate(updateCoinSchema),
  updateCoinHandler
);

// GET ALL --------------------------------------------------------------
/**
 * @openapi
 * /api/coins:
 *   get:
 *     tags:
 *       - Coin
 *     summary: Gets all coins
 *     security:
 *       - BearerAuth: []
 */

router.get("/", getCoinsHandler);

// GET BY ID ------------------------------------------------------------
/**
 * @openapi
 * /api/coins/{id}:
 *   get:
 *     tags:
 *       - Coin
 *     summary: Gets a coin by ID
 */

router.get("/:id", getCoinByIdHandler); // TODO id param schema

// DELETE ---------------------------------------------------------------
/**
 * @openapi
 * /api/coins/{id}:
 *   delete:
 *     tags:
 *       - Coin
 *     summary: Deletes a coin by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the coin to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Coin successfully deleted
 *       '401':
 *         description: Unauthorized, invalid or missing token
 *       '403':
 *         description: Forbidden, insufficient permissions
 */

router.delete(
  "/:id",
  requireUser,
  requirePermission(PERMISSIONS["coins:delete"]),
  validate(deleteCoinSchema),
  deleteCoinHandler
);

export default router;

// TODO add pagination.
// add image to post and update
