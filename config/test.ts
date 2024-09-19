//TODO it is not using port 1338 if I use 1337 it says  address already in use :::1337
export default {
  PORT: 1338,
  DB_URI:
    "mongodb+srv://diogoccthedev:qR5OZYm4sNwTV7Kn@cluster0.eav8z.mongodb.net/coinllector?retryWrites=true&w=majority&appName=Cluster0",
  SALT_WORK_FACTOR: 10,
  accessTokenTtl: "1m",
  refreshTokenTtl: "1y",
  publicKey: `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuOO3KfIJjo74JP+DssTF
  9zMgjE29OVOk3vEuOj0bbCTZi+hErGy/FUs1KK1ZtkysjiL1Rjc0kfrT7BGlUiud
  xhPxrmHjUp+qIcWpS5ketk9m1+BHi37dsdlxZ4CP6uPqLgO0KYDRMvoxjGBrN4gB
  eyUzsbiinPD1Cp9A2xGfqHMGZOaisMpIGXD36BehRJbJwaPzhgE0yNRrlM7VI67I
  NgYRSKk0tZngcqCHw6qjJvR+Cyj9NLVHeS7EBpDvyovBx7kk1qo33eVeQw4foR/v
  S1jZycMqalx6bPh0ozd2LlJFYatklgDGB++OYU0Wpk8Zw40WcY3qOJ1kB3JPOzoR
  0wIDAQAB
  -----END PUBLIC KEY-----`,
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
  MIIEpQIBAAKCAQEAuOO3KfIJjo74JP+DssTF9zMgjE29OVOk3vEuOj0bbCTZi+hE
  rGy/FUs1KK1ZtkysjiL1Rjc0kfrT7BGlUiudxhPxrmHjUp+qIcWpS5ketk9m1+BH
  i37dsdlxZ4CP6uPqLgO0KYDRMvoxjGBrN4gBeyUzsbiinPD1Cp9A2xGfqHMGZOai
  sMpIGXD36BehRJbJwaPzhgE0yNRrlM7VI67INgYRSKk0tZngcqCHw6qjJvR+Cyj9
  NLVHeS7EBpDvyovBx7kk1qo33eVeQw4foR/vS1jZycMqalx6bPh0ozd2LlJFYatk
  lgDGB++OYU0Wpk8Zw40WcY3qOJ1kB3JPOzoR0wIDAQABAoIBAQCCbhpz28yEJjXG
  G/8zaP9jIU1PzTO1Ml237Rq4eQ1UYDacLVHs9ZZjlje9J3WHVlXQu7aePym15eYE
  vnoLGrvl1YIEjAfK7NofkwqYSz/QSvl5Rz4RmYEaCxSmeJqOkRROO8yoDrkGJlw3
  9HkOpsKsthTexirpXk7vnGMraCZitPc1YY8e6KGz93i/X2210cgkOn8TwCzCEEWg
  94MGWxhECnrNPc8VnDXXN4Kg7HK4oxyb3y4Bi/m9wWnzf7mCKzioPdw0XSvxE8wn
  L1vQT1fi6n2CLfRpLNslLs/CX/mh8kjSd1k9z7+GS9h020Zf8NDpIRbUNZvWHuo1
  miZ+9j9pAoGBAOR7IuB1BdtHam7YnRChFPiPopILp3rT8Rtb4TOXe/ls4jF+tjyg
  bh5MJ1Lic82KoFwITSUXlmzj2WTVAQz8zuSUo/2oxzZBkOHMEPltUdip7WieP2OC
  QmiqCmFj68Qr75/q51QYCYPswNtsGzjorbNhp1tZiEHqNnDKvlYI8bYtAoGBAM8o
  gIpMx2JS/DoNKzYaxmgESAzL7wthHgf+hA803ZTr6NDKS2guLkI6bASTnD5+yex4
  7Gl+YYq7uMmvWKFnnJa/YANbqRMg/xzh2+Sa95l3h2cFrTxtRPEhdIuyP7I+CD4D
  rMKVS0QtRTKsnXO90r4TK35utxRG7D00j7cqP+f/AoGAEEqbbQfLGByagTbe1C24
  MhUD0YgVNBPisEG36BbYFyvlYQQY+G+0CmMBts5A1ZoZ3xYUch2hczg36xGpFoT8
  N55FpzOeqMa6Du+fEjnySRGsxPXrrSu/knj1boZSbFV5q5xzTDK+kvKRudOWiVNF
  93FyHnhe19xcb2R1d+sBWS0CgYEAlxe7aSPG6PgN72lbcwLkY0l8I5k6qNoUxU/l
  khHE67GFBYQGq93C75sc3dmrxAlFzawFAoyjKETy6mdyBYdEts6ugMSB9OnEKJSz
  hXFh1hVQNNv3FnO8LQNxtdI0kxSbfl+/ycyKMRezuNodnSV+aBQjTPwDnE5+T8Xe
  bIHsSpECgYEAo+eelLgb87+FqtwY5ey6i5BGxaNnGkGzC6ggmMcsRPH2fPyrKHJX
  iFi7FAQsG1n4KfkxXzteT+VnFDB3VyTZBNvq6TLMzaSYeoeKVBKd1XH+8aTN6dCn
  WOApQwnjwsPsLporxN+AxEhjvbIuRHkhz6bfQ22z2IVa7MFsutdy6tE=
  -----END RSA PRIVATE KEY-----`,
};
