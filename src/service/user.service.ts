import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import UserModel from "../models/user.model";
import { IUserModel } from "../types/user.types";
import { omit } from "lodash";
import qs from "qs";
import config from "config";
import axios from "axios";
import logger from "../utils/logger";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";
import { AppErrorCode } from "../constants/appErrorCode";

interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

// CREATE ----------------------------------------------------------------

export const userService = {
  async create(input: any) {
    const user = await UserModel.create(input);
    return omit(user, "password");
  },

  // FIND ALL -------------------------------------------------------------

  async find() {
    return await UserModel.find();
  },

  // FIND BY ID ------------------------------------------------------------

  async findById(id: string): Promise<IUserModel | null> {
    return await UserModel.findById(id);
  },

  // FIND BY ONE -----------------------------------------------------------

  async findByProp(
    query: FilterQuery<IUserModel>,
    options: QueryOptions = { lean: true }
  ): Promise<IUserModel | null> {
    return await UserModel.findOne(query, {}, options);
  },

  // EXISTS ----------------------------------------------------------------
  async exists(query: FilterQuery<IUserModel>) {
    return await UserModel.exists(query);
  },

  // UPDATE ---------------------------------------------------------------

  async findAndUpdate(
    query: FilterQuery<IUserModel>,
    update: UpdateQuery<IUserModel>,
    options: QueryOptions = {}
  ) {
    return UserModel.findOneAndUpdate(query, update, options);
  },

  // DELETE -----------------------------------------------------------------

  async delete(query: FilterQuery<IUserModel>) {
    return UserModel.deleteOne(query);
  },

  // VALIDATE PASSWORD ------------------------------------------------------

  async validatePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) return false;

      const isValid = await user.comparePassword(password);

      if (!isValid) return false;
      return omit(user, "password");
    } catch (e: any) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        AppErrorCode.INTERNAL_SERVER_ERROR,
        e.message,
        false
      );
    }
  },

  // GOOGLE OAUTH -----------------------------------------------------------

  async getGoogleOauthTokens({
    code,
  }: {
    code: string;
  }): Promise<GoogleTokensResult> {
    const url = "https://oauth2.googleapis.com/token";

    const values = {
      code,
      client_id: config.get<string>("googleClientId"),
      client_secret: config.get<string>("googleClientSecret"),
      redirect_uri: config.get<string>("googleOauthRedirectUrl"),
      grantType: "authorization_code",
    };

    try {
      const res = await axios.post<GoogleTokensResult>(
        url,
        qs.stringify(values),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      return res.data;
    } catch (e: any) {
      logger.error(e, "Failed to fetch Google Oauth Tokens");
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        AppErrorCode.EXTERNAL_SERVICE_ERROR,
        "An unexpected error occurred",
        false
      );
    }
  },

  async getGoogleUser({
    id_token,
    access_token,
  }: {
    id_token: string;
    access_token: string;
  }): Promise<GoogleUserResult> {
    try {
      const res = await axios.get<GoogleUserResult>(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      );
      return res.data;
    } catch (e: any) {
      logger.error(e, "Error fetching Google user");
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        AppErrorCode.INTERNAL_SERVER_ERROR,
        "An unexpected error occurred",
        false
      );
    }
  },

  // IMAGES -----------------------------------------------------------------

  async updateProfilePicture(userId: string, imageUrl: string) {
    return UserModel.findByIdAndUpdate(
      userId,
      { pfp: imageUrl },
      { new: true }
    );
  },
};
