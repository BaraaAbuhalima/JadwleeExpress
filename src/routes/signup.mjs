import httpError from "../utils/http-error.mjs";
import { Router } from "express";
import { matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/hash-helper.mjs";
import { sendVerificationEmail } from "../utils/send-email.mjs";
import { checkSchemaMiddleware } from "../utils/middlewares.mjs";
import { checkNewUserValidationSchema } from "../utils/validationSchemas.mjs";
import { VerificationToken } from "../mongoose/schemas/verification-token.mjs";
import { sendUserIdCookie } from "../utils/login-helper.mjs";

const router = Router();
const wattTimeBetweenEachVerificationRequest = parseInt(process.env.WAIT_TIME);
router.post(
  "/api/signup",
  checkSchemaMiddleware(checkNewUserValidationSchema),
  async (request, response) => {
    const data = matchedData(request);

    data.password = hashPassword(data.password);
    data.username = data.username.trim().toLowerCase();

    let user;
    try {
      user = await User.findOne({ email: data.email });
      if (
        user &&
        !user.strategies.includes("Local") &&
        user.strategies.includes("Google")
      ) {
        await User.updateOne(
          { email: data.email },
          {
            username: data.username,
            password: data.password,
            displayName: data.displayName,
            $addToSet: {
              strategies: "Local",
            },
          }
        );
      } else {
        user = new User({ strategies: ["Local"], ...data });
        await user.save();
      }
    } catch (err) {
      const { keyValue } = err;
      console.log(err);
      let errors;
      if (keyValue)
        errors = [
          new httpError(
            "This " + Object.keys(keyValue)[0] + " is already registered",
            400,
            400,
            "This " + Object.keys(keyValue)[0] + " is already registered",
            "",
            ""
          ),
        ];
      return response.status(400).send({ messageCode: 400, errors });
    }
    sendUserIdCookie(user, response);

    return response.sendStatus(200);
  }
);

router.get("/api/signup/verify/:id/:token", async (request, response) => {
  const { params } = request;
  let token;

  try {
    token = await VerificationToken.findOne({
      token: params.token,
      user_id: params.id,
      expires_at: { $gte: Date.now() },
    });

    if (!token) throw new Error();
  } catch (err) {
    return response.status(403).send({
      messageCode: 403,
      errors: [
        new httpError(
          "This Link Is Invalid Or has Expired",
          403,
          403,
          "This Link Is Invalid or has Expired ",
          "",
          ""
        ),
      ],
    });
  }
  try {
    const findUser = await User.findById(params.id);
    if (findUser.active) throw new Error();
    console.log(findUser);

    request.logIn(findUser, (err) => {});
    await User.updateOne(
      { _id: params.id },
      { active: true, activated_at: Date.now() }
    );

    await VerificationToken.deleteOne({
      token: params.token,
      user_id: params.id,
    });
  } catch (err) {
    console.log(err);
  }
  response.redirect(process.env.FRONT_URL + "dashboard");
});

router.get("/api/signup/getVerificationEmail", async (request, response) => {
  console.log(request.signedCookies?.[process.env.USER_ID_COOKIE]);
  const userID = request.signedCookies?.[process.env.USER_ID_COOKIE];
  if (!userID) {
    return response.status(403).send({
      messageCode: 403,
      errors: [
        new httpError("Invalid Request", 403, 403, "Invalid Request", "", ""),
      ],
    });
  }

  let findUser;
  let token;

  try {
    findUser = await User.findById(userID);
    if (!findUser) throw new Error();
  } catch (err) {
    return response.status(400).send({
      messageCode: 400,
      errors: [new httpError("invalid", 400, 400, "invalid", "", "")],
    });
  }
  if (findUser.active) return response.sendStatus(450);
  try {
    token = await VerificationToken.findOne({ user_id: findUser.id });
    if (
      token &&
      Date.now() - new Date(token.created_at).getTime() <
        wattTimeBetweenEachVerificationRequest
    )
      throw new Error();
  } catch (err) {
    return response.status(400).send({
      time:
        wattTimeBetweenEachVerificationRequest -
        Math.ceil((Date.now() - new Date(token.created_at).getTime()) / 1000),
      messages: {
        messageCode: 400,
        errors: [
          new httpError(
            "You should wait before you request a new email verification",
            400,
            400,
            "You should wait before you request a new email verification",
            "",
            ""
          ),
        ],
      },
    });
  }
  try {
    await sendVerificationEmail(findUser);
    token = await VerificationToken.findOne({ user_id: findUser.id });
    return response.status(200).send({
      time:
        wattTimeBetweenEachVerificationRequest -
        Math.ceil((Date.now() - new Date(token.created_at).getTime()) / 1000),
      messages: [
        `verification email was sent to your email '${findUser.email}`,
      ],
    });
  } catch (err) {
    response.sendStatus(500);
  }
});
router.get("/api/signup/isVerified", async (request, response) => {
  const userID = request.signedCookies?.[process.env.USER_ID_COOKIE];
  try {
    if (!userID) throw new Error();
    const findUser = await User.findById(userID);
    if (!findUser || !findUser.active) throw new Error();

    request.logIn(findUser, (err) => {
      if (err) throw new Error();
      response.sendStatus(200);
    });
  } catch (err) {
    response.sendStatus(403);
  }
});
export default router;
