import { Document, Schema } from "mongoose";

/* E N U M S */

export enum UserRoleEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  APPLICATION_USER = "APPLICATION_USER",
  PAID_USER = "PAID_USER",
}

/* I N T E R F A C E S */

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface IUserModel extends CreateUserInput, Document {
  pfp: string;
  emailVerified: Boolean;
  verificationCode: string;
  passwordResetCode: string;
  role: UserRoleEnum;
  coins: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  omitPrivateFields(): Partial<IUserModel>;
}

// change in future to multiple inputs
