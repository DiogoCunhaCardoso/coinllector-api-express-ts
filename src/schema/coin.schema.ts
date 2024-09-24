import { object, string, TypeOf, number, nativeEnum, coerce, any } from "zod";
import { CoinTypeEnum } from "../types/coin.types";

// REFINEMENTS ---------------------------------------------

const quantityRefinement = (data: any) => {
  if (data.type === CoinTypeEnum.COMMEMORATIVE) {
    return data.quantity !== undefined;
  }

  if (data.quantity !== undefined) return false;

  return true;
};

const dateOrderValidation = (data: any) => {
  const { periodStartDate, periodEndDate } = data;
  if (!periodEndDate) return true;
  return new Date(periodStartDate) < new Date(periodEndDate);
};

// ---------------------------------------------------------

const basePayloadSchema = object({
  type: nativeEnum(CoinTypeEnum, {
    required_error: `Type is required and must be one of the defined enum values: ${Object.values(
      CoinTypeEnum
    ).join(", ")}`,
  }),
  quantity: coerce.number().positive().optional(),
  image: any().optional(),
  periodStartDate: coerce.date({
    required_error: "PeriodStartDate is required",
  }),
  periodEndDate: coerce.date().optional(),
  description: string({ required_error: "Description is required" }).max(511),
});

const payloadSchema = basePayloadSchema
  .refine(quantityRefinement, {
    message: "Quantity must be present for commemorative coins only",
    path: ["quantity"],
  })
  .refine(dateOrderValidation, {
    message: "StartDate must be before EndDate",
    path: ["startDate", "endDate"],
  });

const updatePayloadSchema = basePayloadSchema
  .extend({ country: string().optional() })
  .partial()
  .refine(quantityRefinement, {
    message: "Quantity must be present for commemorative coins only",
    path: ["quantity"],
  })
  .refine(dateOrderValidation, {
    message: "StartDate must be before EndDate",
    path: ["startDate", "endDate"],
  });

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
  body: updatePayloadSchema,
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
