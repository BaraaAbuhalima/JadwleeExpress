import passport from "passport";
import httpError from "../utils/http-error.mjs";
import { Router } from "express";
import { matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import { checkSchemaMiddleware } from "../utils/middlewares.mjs";
import { LoginVerificationCode } from "../mongoose/schemas/login-verification-code.mjs";
import {
  sendUserIdCookie,
  sendVerificationCodeToEmail,
} from "../utils/login-helper.mjs";
import {
  loginSchema,
  loginWithoutPasswordSchema,
  verificationCodeSchema,
} from "../utils/validationSchemas.mjs";

const router = Router();

router.post(
  "/api/login",
  checkSchemaMiddleware(loginSchema),
  (request, response, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return response.status(500);
      }
      const errors = new httpError(
        info?.message,
        info?.customStatusCode || 401,
        401,
        info?.message,
        "",
        request.url
      );
      const responseMessage = {
        messageCode: info.customStatusCode,
        errors: [errors],
      };
      if (!user) {
        return response.status(401).send(responseMessage);
      }
      if (info.customStatusCode === 4000) {
        sendUserIdCookie(user, response);
        return response.status(401).send(responseMessage);
      }

      request.logIn(user, (err) => {
        if (err) {
          return response.sendStatus(500);
        }
        return response.sendStatus(200);
      });
    })(request, response, next);
  }
);

router.post(
  "/api/login/withoutpassword",
  checkSchemaMiddleware(loginWithoutPasswordSchema),
  async (request, response) => {
    const data = matchedData(request);
    let findUser;

    try {
      findUser = await User.findOne({ email: data.email });

      if (!findUser) throw new Error();
    } catch (err) {
      const errors = [
        new httpError(
          "This Email is not registered",
          400,
          400,
          "This Email is not registered,You should signup first ",
          "",
          ""
        ),
      ];

      return response.status(400).send({
        messageCode: 400,
        errors: errors,
      });
    }

    sendUserIdCookie(findUser, response);
    response.sendStatus(200);
  }
);

router.get(
  "/api/login/withoutpassword/getVerificationCode",
  async (request, response) => {
    const userID = request.signedCookies?.[process.env.USER_ID_COOKIE];

    if (!userID)
      return response.status(403).send({
        errors: [
          new httpError("invalid Request", 403, 403, "invalid Request", "", ""),
        ],
        messageCode: 403,
      });
    sendVerificationCodeToEmail(userID, response);
  }
);

router.post(
  "/api/login/withoutpassword/checkVerificationCode",
  checkSchemaMiddleware(verificationCodeSchema),
  async (request, response, next) => {
    const { verificationCode } = matchedData(request);
    const userID = request.signedCookies?.[process.env.USER_ID_COOKIE];
    let code;
    try {
      code = await LoginVerificationCode.findOne({
        user_id: userID,
        code: verificationCode,
      });
      if (!code) throw new Error();
    } catch (err) {
      const errors = new httpError(
        "The Code it not valid or it has expired",
        400,
        400,
        "The Code it not valid or it has expired",
        "",
        ""
      );
      return response.status(400).send({
        messageCode: 400,
        errors: [errors],
      });
    }

    let user;

    try {
      await LoginVerificationCode.deleteOne({
        user_id: userID,
        code: verificationCode,
      });

      user = await User.findById(userID);

      if (!user.active) {
        await User.updateOne(
          { _id: user._id },
          { active: true, activated_at: Date.now() }
        );
      }
      request.logIn(user, (err) => {
        if (err) {
          throw new Error();
        }
        response.status(200).send({ messageCode: 200 });
      });
    } catch (err) {
      console.log(err);
      response.status(401).send({ messageCode: 400 });
    }
  }
);

export default router;
