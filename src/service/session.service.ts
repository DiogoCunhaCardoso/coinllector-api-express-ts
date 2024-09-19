import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { ISessionModel } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get, omit } from "lodash";
import { userService } from "./user.service";
import config from "config";
import { privateFields } from "../models/user.model";
import { StatusCodes } from "http-status-codes";
import { ROLE_PERMISSIONS, RoleType } from "../constants/permissions";

export const sessionService = {
  // CREATE ----------------------------------------------------------------

  async create(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent });

    return session.toJSON();
  },

  // FIND ------------------------------------------------------------------

  async find(query: FilterQuery<ISessionModel>) {
    return await SessionModel.find(query).lean();
  },

  // UPDATE -----------------------------------------------------------------

  async update(
    query: FilterQuery<ISessionModel>,
    update: UpdateQuery<ISessionModel>
  ) {
    return await SessionModel.updateOne(query, update);
  },

  // REISSUE TOKEN------------------------------------------------------------

  async reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = verifyJwt(refreshToken);

    if (!decoded || !get(decoded, "session")) return false;

    const session = await SessionModel.findById(get(decoded, "session"));

    if (!session || !session.valid) return false;

    const user = await userService.findByProp(
      { _id: session.user },
      { lean: false }
    );

    if (!user) return false;

    const userRole: RoleType = user.role;
    const scopes = ROLE_PERMISSIONS[userRole] || "";

    const userSafePayload = omit(user.toJSON(), privateFields);

    const accessToken = signJwt(
      { ...userSafePayload, scopes, session: session._id },
      { expiresIn: config.get<string>("accessTokenTtl") } // 15min
    );

    return accessToken;
  },
};
