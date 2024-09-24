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
import upload from "../middleware/multer";

// prefix - /api
const router = Router();

// CREATE ---------------------------------------------------------------\
/**
 * @openapi
 * /api/countries/{countryName}/coins:
 *   post:
 *     tags:
 *       - Coin
 *     summary: Creates a coin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: countryName
 *         in: path
 *         required: true
 *         description: The name of the country for which the coin is being created.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: ["type", "periodStartDate", "description"]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [COMMEMORATIVE, "2 EURO", "1 EURO", "50 CENT", "20 CENT", "10 CENT", "5 CENT", "2 CENT", "1 CENT"]
 *                 description: The type of the coin. Must be one of the defined enum values.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the coin (required only for COMMEMORATIVE coins).
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the coin.
 *               periodStartDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the coin's issuance period.
 *               periodEndDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the coin's issuance period (don't use if the coin is still being issued).
 *               description:
 *                 type: string
 *                 description: A description of the coin. You can provide a detailed description here.
 *                 example: "This is a detailed description of the coin, highlighting its unique features."
 *     responses:
 *       201:
 *         description: Coin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coin'
 *       400:
 *         description: Bad request (validation errors)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Country not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/countries/:countryName/coins",
  requireUser,
  requirePermission(PERMISSIONS["coins:write"]),
  upload.single("image"),
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
  "/coins/:id",
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
 *     summary: Gets a list of all coins
 *     parameters:
 *       - name: type
 *         in: query
 *         description: Filter to retrieve coins of a specific type. (optional)
 *         schema:
 *           type: string
 *           enum:
 *             - COMMEMORATIVE
 *             - "2 EURO"
 *             - "1 EURO"
 *             - "50 CENT"
 *             - "20 CENT"
 *             - "10 CENT"
 *             - "5 CENT"
 *             - "2 CENT"
 *             - "1 CENT"
 *       - name: country
 *         in: query
 *         description: Filter to retrieve coins from a specific country by name. (optional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of coins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coin'
 *       500:
 *         description: Internal server error
 */

router.get("/coins", getCoinsHandler);

// GET BY ID ------------------------------------------------------------
/**
 * @openapi
 * /api/coins/{id}:
 *   get:
 *     tags:
 *       - Coin
 *     summary: Gets a coin by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the coin to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the coin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coin'
 *       404:
 *         description: Coin not found
 *       500:
 *         description: Internal server error
 */

router.get("/coins/:id", getCoinByIdHandler);

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
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Coin not Found
 */

router.delete(
  "/coins/:id",
  requireUser,
  requirePermission(PERMISSIONS["coins:delete"]),
  validate(deleteCoinSchema),
  deleteCoinHandler
);

export default router;

// TODO add pagination.
// add image to post and update
