import { Schema, model, models } from "mongoose";
import { IUserModel } from "../types/user.types";

// I N T E R F A C E

export interface ISessionModel extends Document {
  user: IUserModel["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       description: Full Session object schema.
 *       properties:
 *         _id:
 *           type: string
 *           example: 66dd5dd3d331876b91e76810
 *         user:
 *           type: string
 *           description: ID of the user associated with the session.
 *           example: 66dd5dd3d331876b91e76810
 *         valid:
 *           type: boolean
 *           description: Indicates if the session is valid.
 *           example: true
 *         userAgent:
 *           type: string
 *           description: The user agent string from the request.
 *           example: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// S C H E M A

const sessionSchema = new Schema<ISessionModel>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// M O D E L

const SessionModel =
  models.Session || model<ISessionModel>("Session", sessionSchema);

export default SessionModel;
