import { Router } from "express";
import validate from "../middleware/validateResource.middleware";
import { requireUser } from "../middleware/requireUser.middleware";
import { requirePermission } from "../middleware/requirePermission";
import uploadImage from "../middleware/multer";
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

// prefix - /api/countries

// CREATE ---------------------------------------------------------------

/**
 * @openapi
 * /api/countries:
 *   post:
 *     tags:
 *       - Country
 *     summary: Creates a country
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - flagImage
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the country.
 *                 example: Portugal
 *               flagImage:
 *                 type: string
 *                 format: binary
 *                 description: The flag image of the country (JPEG, JPG, PNG).
 *     responses:
 *       201:
 *         description: Country created successfully
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Country'
 *       400:
 *         description: Bad request (validation errors)
 *       409:
 *         description: Conflict (country name is already in use)
 *       500:
 *         description: Internal server error
 */

router.post(
  "/",
  /* requireUser, */
  /* requirePermission(PERMISSIONS["countries:write"]), */
  uploadImage.single("flagImage"),
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
 *        200:
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *        500:
 *         description: Internal server error
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
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: The name of the country to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the country
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       404:
 *         description: Country not found
 *       500:
 *         description: Internal server error
 */
router.get("/:name", validate(getCountrySchema), getCountryByNameHandler);

// DELETE ---------------------------------------------------------------

/**
 * @openapi
 * /api/countries/{name}:
 *   delete:
 *     tags:
 *       - Country
 *     summary: Deletes a country by name
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: The name of the country to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Country successfully deleted
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
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
