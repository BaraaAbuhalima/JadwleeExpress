import { validationResult, checkSchema } from "express-validator";
import httpError from "./http-error.mjs";
export const checkSchemaMiddleware = (schema) => {
  return [
    checkSchema(schema),
    (request, response, next) => {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(400).send({
          messageCode: 400,
          errors: result.errors.map(
            (ele) => new httpError(ele.msg, 400, 400, ele.msg, "", "")
          ),
        });
      }
      next();
    },
  ];
};
export const checkIsAuthenticatedMiddleware = (request, response, next) => {
  if (!request.user) {
    response.clearCookie(process.env.SESSION_NAME, {
      path: "/",
      secure: process.env.SESSION_COOKIE_SECURE === "true",
      httpOnly: process.env.HTTP_ONLY === "true",
      sameSite: process.env.SESSION_COOKIE_SAME_SITE,
    });
    return response.status(401).send({
      messageCode: 401,
      errors: [
        new httpError(
          "Your are not Authenticated",
          401,
          401,
          "You are not Authenticated please login or signup",
          "",
          ""
        ),
      ],
    });
  }
  next();
};
