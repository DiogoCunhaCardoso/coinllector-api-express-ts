import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import { config } from "../constants/env";
import crypto from "crypto";
import { IUserModel, UserRoleEnum } from "../types/user.types";
import { omit } from "lodash";

export const privateFields = [
  "emailVerified",
  "verificationCode",
  "passwordResetCode",
  "role",
  "password",
  "__v",
];

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Full User object schema.
 *       properties:
 *         _id:
 *           type: string
 *           example: 60c72b2f9b1e8d2f6c8f8e5f
 *         name:
 *           type: string
 *           example: John Doe
 *         pfp:
 *           type: string
 *           format: uri
 *           description: URL of the user's profile picture.
 *           example: http://cloudinary/profile.jpg
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         emailVerified:
 *           type: boolean
 *           example: true
 *         verificationCode:
 *           type: string
 *           description: OTP used for email verification.
 *           example: 123456
 *         passwordResetCode:
 *           type: string
 *           description: OTP used for password reset.
 *           example: 123456
 *         role:
 *           type: string
 *           enum:
 *             - SUPER_ADMIN
 *             - APPLICATION_USER
 *             - PAID_USER
 *           example: APPLICATION_USER
 *         password:
 *           type: string
 *           example: $2b$10$EIXw0Y2HbHn5F5fHfJ0N6eJ0J0eT0aFTvTIbQ1klU6i
 *         coins:
 *           type: array
 *           items:
 *             type: string
 *           description: List of coin IDs the user has.
 *           example:
 *             - 60c72b2f9b1e8d2f6c8f8e5f
 *             - 60c72b2f9b1e8d2f6c8f8e6f
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-09-06T19:53:55.486Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-09-07T07:51:31.262Z
 */

// S C H E M A

const userSchema = new Schema<IUserModel>(
  {
    name: { type: String, required: true },
    pfp: { type: String },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetCode: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      trim: true,
      uppercase: true,
      default: UserRoleEnum.APPLICATION_USER,
    },
    password: { type: String, required: true },
    coins: {
      type: [{ type: Schema.Types.ObjectId, ref: "Coin" }],
    },
  },
  {
    timestamps: true,
  }
);

// H A S H _ P A S S W O R D

userSchema.pre("save", async function (next) {
  let user = this as IUserModel;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

// M E T H O D S

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUserModel;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

userSchema.methods.omitPrivateFields = function (): object {
  return omit(this.toJSON(), privateFields);
};

// M O D E L

const UserModel = models.User || model<IUserModel>("User", userSchema);

export default UserModel;
