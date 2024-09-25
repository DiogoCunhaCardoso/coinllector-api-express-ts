import dotenv from "dotenv";
import path from "path";

// Parsing Utils
const parseBoolean = (value: string | undefined): boolean => {
  if (value === undefined) return false;
  return value.toLowerCase() === "true";
};

const parseNumber = (value: string | undefined): number | undefined => {
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

// Load the appropriate .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

// Validate env. variables presence
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
};

// All env. variables
export const config = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: parseNumber(getEnv("PORT", "4004")) || 4004,
  DOMAIN: getEnv("DOMAIN"),
  APP_ORIGIN: getEnv("ORIGIN"),
  MONGO_URI: getEnv("MONGO_URI"),
  PUBLIC_KEY: getEnv("PUBLIC_KEY"),
  PRIVATE_KEY: getEnv("PRIVATE_KEY"),
  SALT_WORK_FACTOR: parseNumber(getEnv("SALT_WORK_FACTOR")) || 10,
  ACCESS_TOKEN_TTL: getEnv("ACCESS_TOKEN_TTL"),
  REFRESH_TOKEN_TTL: getEnv("REFRESH_TOKEN_TTL"),
  GOOGLE: {
    CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    OAUTH_REDIRECT_URL: getEnv("GOOGLE_OAUTH_REDIRECT_URL"),
  },
  SMTP: {
    USER: getEnv("SMTP_USER"),
    PASSWORD: getEnv("SMTP_PASS"),
    HOST: getEnv("SMTP_HOST"),
    PORT: parseNumber(getEnv("SMTP_PORT")),
    SECURE: parseBoolean(getEnv("SMTP_SECURE")),
  },
  CLOUDINARY: {
    NAME: getEnv("CLOUDINARY_NAME"),
    API_KEY: getEnv("CLOUDINARY_API_KEY"),
    API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
  },
  EMAIL_SENDER: getEnv("EMAIL_SENDER"),
};
