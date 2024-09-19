import { Document } from "mongoose";

/* E N U M S */

import { ICountryModel } from "./country.types";

export enum CoinTypeEnum {
  COMMEMORATIVE = "COMMEMORATIVE",
  TWO_EURO = "2 EURO",
  ONE_EURO = "1 EURO",
  FIFTY_CENT = "50 CENT",
  TWENTY_CENT = "20 CENT",
  TEN_CENT = "10 CENT",
  FIVE_CENT = "5 CENT",
  TWO_CENT = "2 CENT",
  ONE_CENT = "1 CENT",
}

/* I N T E R F A C E S */

export interface CreateCoinInput {
  type: CoinTypeEnum;
  image?: String;
  quantity?: Number;
  period?: {
    startDate: Date;
    endDate?: Date;
  };
  description: String;
  country: ICountryModel["_id"];
}

export type CoinFilter = {
  type?: string;
  country?: string;
};

export interface UpdateCoinInput extends CreateCoinInput {}

export interface ICoinModel extends CreateCoinInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

// change in future to multiple inputs
