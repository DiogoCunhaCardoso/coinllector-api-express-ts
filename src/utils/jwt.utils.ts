import jwt from "jsonwebtoken";
import { config } from "../constants/env";

export const signToken = (
  payload: Object,
  options?: jwt.SignOptions | undefined
) => {
  const newToken = jwt.sign(payload, config.PRIVATE_KEY, {
    ...(options && options),
    algorithm: "RS256",
  });

  return newToken;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.PUBLIC_KEY /* , { algorithms: ["RS256"] } */
    );

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
};
