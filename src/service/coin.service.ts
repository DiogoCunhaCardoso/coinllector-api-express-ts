import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CoinModel from "../models/coin.model";
import { CoinFilter, CreateCoinInput, ICoinModel } from "../types/coin.types";

export const coinService = {
  // CREATE ----------------------------------------------------------------

  async create(input: CreateCoinInput) {
    return await CoinModel.create(input);
  },

  // FIND ALL -------------------------------------------------------------

  async find(filter: CoinFilter) {
    return await CoinModel.find(filter);
  },

  // FIND BY ID -----------------------------------------------------------

  async findById(id: string): Promise<ICoinModel | null> {
    return await CoinModel.findById(id);
  },

  // UPDATE ---------------------------------------------------------------

  async findAndUpdate(
    query: FilterQuery<ICoinModel>,
    update: UpdateQuery<ICoinModel>,
    options: QueryOptions
  ) {
    return await CoinModel.findOneAndUpdate(query, update, options);
  },

  // DELETE ----------------------------------------------------------------

  async delete(query: FilterQuery<ICoinModel>) {
    return await CoinModel.deleteOne(query);
  },
};
