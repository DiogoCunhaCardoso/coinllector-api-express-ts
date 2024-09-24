export const MAX_IMAGE_SIZE = 2000000; //2 MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
// To write only whats after the image/
export const ACCEPTED_IMAGE_TYPES_NO_PREFIX = ACCEPTED_IMAGE_TYPES.map(
  (type) => type.split("/")[1]
);
