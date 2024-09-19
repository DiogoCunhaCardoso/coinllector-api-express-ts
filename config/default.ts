/*
  Confidential fields are in .env (add yours)
  Custom-environment-variables.ts will call the variables from .env automatically.
*/

export default {
  PORT: 1337,
  domain: "",
  origin: "",
  DB_URI: "",
  SALT_WORK_FACTOR: "",
  accessTokenTtl: "",
  refreshTokenTtl: "",
  publicKey: ``,
  privateKey: ``,
  googleClientId: "",
  googleClientSecret: "",
  googleOauthRedirectUrl: "",
  smtp: {
    user: "",
    pass: "",
    host: "",
    port: "",
    secure: "",
  },
  cloudinaryName: "",
  cloudinaryApiKey: "",
  cloudinaryApiSecret: "",
};
