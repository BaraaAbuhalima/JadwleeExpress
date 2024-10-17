import httpError from "./http-error.mjs";

export const notAuthenticatedError = {
  errors: [
    new httpError(
      "You Are Not Authenticated ",
      401,
      401,
      "You are not Authenticated you should login or signup first",
      "",
      ""
    ),
  ],
};
export const createErrorResponse = (status, message) => {
  return {
    status,
    message,
  };
};
