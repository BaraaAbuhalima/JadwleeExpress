import { generateVerificationCode } from "./hash-helper.mjs";
import { sendEmail } from "./send-email.mjs";
import { LoginVerificationCode } from "../mongoose/schemas/login-verification-code.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import httpError from "./http-error.mjs";
export const sendVerificationCodeToEmail = async (id, response) => {
  const message = generateVerificationCode();
  let findUser;

  let lastVerificationCode;
  try {
    findUser = await User.findById(id);
    lastVerificationCode = await LoginVerificationCode.findOne({
      user_id: findUser.id,
    });
  } catch (err) {
    response.sendStatus(500);
  }
  try {
    if (
      lastVerificationCode &&
      Date.now() - new Date(lastVerificationCode.created_at).getTime() <
        parseInt(process.env.WAIT_TIME)
    ) {
      console.log(
        Date.now() - new Date(lastVerificationCode.created_at).getTime()
      );

      throw new Error();
    }
  } catch (err) {
    return response.status(400).send({
      time: getRemainingTime(lastVerificationCode.created_at),
      messages: {
        messageCode: 400,
        errors: [
          new httpError(
            "Pleas Wait for the next code you request",
            400,
            400,
            "",
            "",
            ""
          ),
        ],
      },
    });
  }

  try {
    await LoginVerificationCode.deleteMany({ user_id: findUser.id });
    await new LoginVerificationCode({
      user_id: findUser.id,
      code: message,
    }).save();
  } catch (err) {
    return response.sendStatus(500);
  }
  await sendEmail(findUser.email, message, "reset password");

  lastVerificationCode = await LoginVerificationCode.findOne({
    user_id: findUser.id,
  });
  response.status(200).send({
    time: getRemainingTime(lastVerificationCode.created_at),
    messages: [
      "Check Your Email For Verification Code will, it Expire after 5 minutes",
    ],
  });
};
const getRemainingTime = (createdTime) => {
  console.log(createdTime);
  console.log(parseInt(process.env.WAIT_TIME));
  console.log(parseInt(process.env.WAIT_TIME));
  console.log(new Date(createdTime).getTime());
  return Math.ceil(
    (parseInt(process.env.WAIT_TIME) -
      Date.now() +
      new Date(createdTime).getTime()) /
      1000
  ) >= 0
    ? Math.ceil(
        (parseInt(process.env.WAIT_TIME) -
          Date.now() +
          new Date(createdTime).getTime()) /
          1000
      )
    : parseInt(process.env.WAIT_TIME) / 1000;
};
export const sendUserIdCookie = (user, response) => {
  response.cookie(process.env.USER_ID_COOKIE, user.id, {
    secure: true,
    httpOnly: false,
    sameSite: "none",
    signed: true,
  });
};
export const convertDisplaynameToUsername = async (displayName) => {
  let username = displayName.trim().toLowerCase();

  username = username.replace(/\s+/g, "_");
  const min = 10000;
  const max = 100000;
  username = username.replace(/[^a-z0-9_]/g, "");
  let random = getRandomInRange(min, max);
  while (await User.findOne({ username: username + random })) {
    random = getRandomInRange(min, max);
  }
  return username + random;
};
const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
