import { Router } from "express";
import {
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware,
} from "../utils/middlewares.mjs";
import { contactUsMailSchema } from "../utils/validationSchemas.mjs";
import { matchedData } from "express-validator";
import { sendEmail } from "../utils/send-email.mjs";
const router = Router();

router.post(
  "/api/user/contactUs",
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware(contactUsMailSchema),
  async (request, response) => {
    const { message, subject } = matchedData(request);
    const flag = await sendEmail(
      process.env.EMAIL,
      "Email was sent by \n email: " +
        request.user.email +
        "\nstudent Name :" +
        request.user.realName +
        "\n" +
        message,
      subject
    );
    return response.status(flag ? 200 : 500).send({
      flag,
      message: flag
        ? "Your Message was successfully sent"
        : "Error sending message",
    });
  }
);

export default router;
