// MAX_AGE
export const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
export const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

//EXPIRES_AT
export const FiveMinutesAgo = () => {
  return new Date(Date.now() - 5 * 60 * 1000);
};

export const oneHourFromNow = () => {
  return new Date(Date.now() + 60 * 60 * 1000);
};

export const oneYearFromNow = () => {
  return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
};
