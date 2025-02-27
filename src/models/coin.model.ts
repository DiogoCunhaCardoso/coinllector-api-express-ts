import { Schema, model, models } from "mongoose";
import { ICoinModel, CoinTypeEnum } from "../types/coin.types";

/**
 * @openapi
 * components:
 *   schemas:
 *     Coin:
 *       type: object
 *       description: Full Coin object schema.
 *       properties:
 *         _id:
 *           type: string
 *           example: 66db5dd3d331876b91e76815
 *         type:
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
 *           example: COMMEMORATIVE
 *         image:
 *           type: string
 *           format: uri
 *           example: https://res.cloudinary.com/abcdefg/coin_countryName_type_123456.png
 *         quantity:
 *           type: number
 *           description: Quantity of commemorative coins.
 *           example: 25000
 *         periodStartDate:
 *           type: string
 *           format: date
 *           example: 2002-02-02
 *         periodEndDate:
 *           type: string
 *           format: date
 *           example: 2012-02-02
 *         description:
 *           type: string
 *           example: The coin face represent the shield and castles from Portugal.
 *         country:
 *           type: string
 *           description: The ID of the country associated with the coin.
 *           example: 66dd5dd3d331876b91e76810
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// S C H E M A

const coinSchema = new Schema<ICoinModel>(
  {
    type: {
      type: String,
      enum: Object.values(CoinTypeEnum),
      required: true,
      uppercase: true,
    },
    image: {
      type: String,
    },
    quantity: {
      type: Number,
    },

    periodStartDate: { type: Date, required: true },
    periodEndDate: { type: Date },

    description: {
      type: String,
      required: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// M O D E L

const CoinModel = models.Coin || model<ICoinModel>("Coin", coinSchema);

export default CoinModel;
