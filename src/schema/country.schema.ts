import { any, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CountryCreateInput:
 *      type: object
 *      description: Schema for creating a new Country
 *      required:
 *        - name
 *        - flagImage
 *        - joinedOn
 *      properties:
 *        name:
 *          type: string
 *          example: Country Name
 *        flagImage:
 *          type: string
 *          format: uri
 *          example: http://cloudinary/image
 *        joinedOn:
 *          type: string
 *          format: date
 *          example: 2002-02-02
 */

const payloadSchema = object({
  name: string({
    required_error: "Name is required",
  })
    .min(1, "Name cannot be empty")
    .transform((name) => name.toLowerCase()),

  flagImage: any(), //TODO rn it works but on controller... (create country)

  joinedOn: string({
    required_error: "JoinedOn is required",
  }).date("JoinedOn must be a valid date format"),
});

const paramsSchema = object({
  name: string({
    required_error: "Country name is required",
  }),
});

export const createCountrySchema = object({
  body: payloadSchema,
});

export const updateCountrySchema = object({
  body: payloadSchema.partial(),
  params: paramsSchema,
});

export const getCountrySchema = object({
  params: paramsSchema,
});

export const deleteCountrySchema = object({
  params: paramsSchema,
});

export type CreateCountryInput = TypeOf<typeof createCountrySchema>;
export type UpdateCountryInput = TypeOf<typeof updateCountrySchema>;
export type GetCountryInput = TypeOf<typeof getCountrySchema>;
export type DeleteCountryInput = TypeOf<typeof deleteCountrySchema>;
