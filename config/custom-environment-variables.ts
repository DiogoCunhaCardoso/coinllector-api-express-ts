export default {
  domain: "DOMAIN",
  origin: "ORIGIN",
  DB_URI: "DB_URI",
  publicKey: "PUBLIC_KEY",
  privateKey: "PRIVATE_KEY",
  SALT_WORK_FACTOR: { __name: "SALT_WORK_FACTOR", __format: "json" },
  accessTokenTtl: "ACCESS_TOKEN_TTL",
  refreshTokenTtl: "REFRESH_TOKEN_TTL",

  googleClientId: "GOOGLE_CLIENT_ID",
  googleClientSecret: "GOOGLE_CLIENT_SECRET",
  googleOauthRedirectUrl: "GOOGLE_OAUTH_REDIRECT_URL",

  smtp: {
    user: "SMTP_USER",
    pass: "SMTP_PASS",
    host: "SMTP_HOST",
    port: "SMTP_PORT",
    secure: { __name: "SMTP_SECURE", __format: "json" },
  },

  cloudinaryName: "CLOUDINARY_NAME",
  cloudinaryApiKey: "CLOUDINARY_API_KEY",
  cloudinaryApiSecret: "CLOUDINARY_API_SECRET",
};
