import { object, string, TypeOf, number, nativeEnum, coerce } from "zod";
import { CoinTypeEnum } from "../types/coin.types";

//TODO add .max for every schema for safety

const dateSchema = string().pipe(coerce.date());

const payloadSchema = object({
  type: nativeEnum(CoinTypeEnum, {
    required_error: `Type is required and must be one of the defined enum values: ${Object.values(
      CoinTypeEnum
    ).join(", ")}`,
  }),
  quantity: number().positive().optional(),
  image: string().optional(), //TODO change this
  period: object({
    startDate: dateSchema,
    endDate: dateSchema.optional(),
  }).optional(),
  description: string({ required_error: "Description is required" }),
}); /* TODO .refine(
  (data) => data.type !== CoinTypeEnum.COMMEMORATIVE || data.quantity !== undefined,
  {
    message: "Quantity is required for commemorative coins",
    path: ["quantity"],
  }
); */

const paramsSchema = object({
  id: string({
    required_error: "Coin id is required",
  }),
});

const paramsSchemaCountry = object({
  countryName: string({
    required_error: "Country name is required",
  }),
});

//
//
//

/* S C H E M A S */

export const createCoinSchema = object({
  params: paramsSchemaCountry,
  body: payloadSchema,
});

export const updateCoinSchema = object({
  body: payloadSchema.partial(),
  params: paramsSchema,
});

export const getCoinSchema = object({
  params: paramsSchema,
});

export const deleteCoinSchema = object({
  params: paramsSchema,
});

/* T Y P E S */

export type CreateCoinInput = TypeOf<typeof createCoinSchema>;
export type UpdateCoinInput = TypeOf<typeof updateCoinSchema>;
export type GetCoinInput = TypeOf<typeof getCoinSchema>;
export type DeleteCoinInput = TypeOf<typeof deleteCoinSchema>;
