import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export const signJwt = (
  payload: Object,
  options?: jwt.SignOptions | undefined
) => {
  const newToken = jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });

  return newToken;
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      publicKey /* , { algorithms: ["RS256"] } */
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
