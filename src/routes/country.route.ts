import { Router } from "express";
import validate from "../middleware/validateResource.middleware";
import { requireUser } from "../middleware/requireUser.middleware";
import { requirePermission } from "../middleware/requirePermission";
import upload from "../middleware/multer";
import { PERMISSIONS } from "../constants/permissions";
import {
  createCountrySchema,
  updateCountrySchema,
  getCountrySchema,
  deleteCountrySchema,
} from "../schema";
import {
  createCountryHandler,
  updateCountryHandler,
  getCountriesHandler,
  getCountryByNameHandler,
  deleteCountryHandler,
} from "../controller";

const router = Router();

// CREATE ---------------------------------------------------------------

/**
 * @openapi
 * /api/countries:
 *   post:
 *     tags:
 *       - Country
 *     summary: Creates a country
 *     security:
 *       - BearerAuth: []
 */

router.post(
  "/",
  /* requireUser, */
  /* requirePermission(PERMISSIONS["countries:write"]), */
  upload.single("flagImage"),
  validate(createCountrySchema),
  createCountryHandler
);

// UPDATE ---------------------------------------------------------------
/**
 * @openapi
 * /api/countries/{name}:
 *   patch:
 *     tags:
 *       - Country
 *     summary: Updates a country by its name
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: name
 *         in: path
 *         description: The name of the country to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               capital:
 *                 type: string
 *                 description: The new capital of the country
 *               population:
 *                 type: integer
 *                 description: The new population of the country
 *             required:
 *               - capital
 *               - population
 *     responses:
 *       '200':
 *         description: Country successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the country
 *                 capital:
 *                   type: string
 *                   description: The updated capital of the country
 *                 population:
 *                   type: integer
 *                   description: The updated population of the country
 *       '400':
 *         description: Bad request, validation error
 *       '404':
 *         description: Country not found
 *       '403':
 *         description: Forbidden, insufficient permissions
 */

router.patch(
  "/:name",
  requireUser,
  requirePermission(PERMISSIONS["countries:update"]),
  validate(updateCountrySchema),
  updateCountryHandler
);

// GET ALL --------------------------------------------------------------
/**
 * @openapi
 * /api/countries:
 *   get:
 *     tags:
 *       - Country
 *     summary: Gets all countries

 *     description: Retrieve a list of all countries
 *     responses:
 *       '200':
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 */
router.get("/", getCountriesHandler);

// GET BY NAME ----------------------------------------------------------

/**
 * @openapi
 * /api/countries/{name}:
 *   get:
 *     tags:
 *       - Country
 *     summary: Gets a country by name
 */
router.get("/:name", validate(getCountrySchema), getCountryByNameHandler);

// DELETE ---------------------------------------------------------------

/**
 * @openapi
 * /api/countries:
 *   delete:
 *     tags:
 *       - Country
 *     summary: Deletes a country by name
 *     security:
 *       - BearerAuth: []
 */

router.delete(
  "/:name",
  requireUser,
  requirePermission(PERMISSIONS["countries:delete"]),
  validate(deleteCountrySchema),
  deleteCountryHandler
);

export default router;

//TODO add image route. update image route. (maybe have a put only)
