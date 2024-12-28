import nodemailer from "nodemailer";
import { VerificationToken } from "../mongoose/schemas/verification-token.mjs";
import crypto from "crypto";
const sendEmail = async (toEmail, text, subject) => {
  console.log(process.env.EMAIL_USER);
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      to: toEmail,
      subject: subject,
      text: text,
      // html: "<b>Hello worldfsdfdsfd?</b>", // html body
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (err) {
    return false;
    console.log(err);
  }
};
const sendVerificationEmail = async (user) => {
  try {
    await VerificationToken.deleteOne({ user_id: user.id });
    const token = new VerificationToken({
      user_id: user.id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    console.log(token);
    await token.save();
    const message = `${process.env.BASE_URL}/api/signup/verify/${user.id}/${token.token}`;
    sendEmail(user.email, message, "email verification");
  } catch (err) {}
};
export { sendEmail, sendVerificationEmail };
