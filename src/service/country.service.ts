import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CountryModel from "../models/country.model";
import { CreateCountryInput, ICountryModel } from "../types/country.types";

export const countryService = {
  // CREATE ----------------------------------------------------------------

  async create(input: CreateCountryInput) {
    return await CountryModel.create(input);
    //TODO error custom class - e.g. of error RN MongoServerError: E11000 duplicate key error collection: coinllector.countries index: name_1 dup key: { name: "string" }
  },

  // FIND ALL -------------------------------------------------------------

  async find() {
    return await CountryModel.find();
  },

  // FIND BY ONE -----------------------------------------------------------

  async findByName(
    query: FilterQuery<ICountryModel>,
    options: QueryOptions = { lean: true }
  ) {
    return await CountryModel.findOne(query, {}, options);
  },

  // UPDATE ---------------------------------------------------------------

  async findAndUpdate(
    query: FilterQuery<ICountryModel>,
    update: UpdateQuery<ICountryModel>,
    options: QueryOptions
  ) {
    return await CountryModel.findOneAndUpdate(query, update, options);
  },

  // DELETE -----------------------------------------------------------------

  async delete(query: FilterQuery<ICountryModel>) {
    return await CountryModel.deleteOne(query);
  },

  // GET Country ID by given name

  async getCountryIdByName(name: string) {
    const country = await CountryModel.findOne({ name }).exec();
    return country ? country._id.toString() : null;
  },
};
