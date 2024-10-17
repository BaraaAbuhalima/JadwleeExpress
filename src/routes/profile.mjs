import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import multer from "multer";
import {
  checkSchemaMiddleware,
  checkIsAuthenticatedMiddleware,
} from "../utils/middlewares.mjs";
import { matchedData } from "express-validator";
import {
  updateUserPasswordSchema,
  updateDisplayNameSchema,
} from "../utils/validationSchemas.mjs";
import { hashPassword } from "../utils/hash-helper.mjs";
import httpError from "../utils/http-error.mjs";
const upload = multer();
const router = Router();

router.patch(
  "/api/user/updateProfilePicture",
  upload.single("photo"),
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    let findUser = request.user;
    if (!request.file) {
      response.status(400).send({
        messageCode: 400,
        errors: [
          new httpError(
            "No file was included",
            400,
            400,
            "No file was included",
            "",
            ""
          ),
        ],
      });
    }
    if (request.file.size > 5 * 1024 * 1024)
      response.status(400).send({
        messageCode: 400,
        errors: [
          new httpError(
            "Maximum size is 5MB",
            400,
            400,
            "Maximum size is 5MB",
            "",
            ""
          ),
        ],
      });
    try {
      await User.updateOne(
        { _id: findUser._id },
        {
          photo: request.file,
        }
      );
      findUser = await User.findById(findUser.id);
      const b = findUser.photo.buffer.toString("base64");
      const imageBuffer = Buffer.from(b, "base64");
      return response.set("Content-Type", "image/png").send(imageBuffer);
    } catch (err) {
      return response.sendStatus(500);
    }
  }
);
router.get(
  "/api/user/profilePicture",
  checkIsAuthenticatedMiddleware,
  (request, response) => {
    const user = request.user;
    try {
      const b = user.photo.buffer.toString("base64");
      const imageBuffer = Buffer.from(b, "base64");
      response.set("Content-Type", "image/webp").send(imageBuffer);
      return user;
    } catch (err) {
      console.log(err);
      response.sendStatus(500);
    }
  }
);
router.get(
  "/api/user/profile",
  checkIsAuthenticatedMiddleware,
  (request, response) => {
    const user = request.user;
    response.status(200).send({
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      userNumber: user.userNumber,
      role: user.role,
    });
  }
);
router.patch(
  "/api/user/changePassword",
  checkSchemaMiddleware(updateUserPasswordSchema),
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const data = matchedData(request);

    try {
      await User.updateOne(
        { _id: request.user._id },
        {
          password: hashPassword(data.password),
          username: data.username,
          active: true,
          $addToSet: {
            strategies: "Local",
          },
        }
      );
      response.status(200).send(["Password Changed Successfully "]);
    } catch (err) {
      response.sendStatus(500);
    }
  }
);
router.patch(
  "/api/user/changeDisplayName",
  checkSchemaMiddleware(updateDisplayNameSchema),
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const data = matchedData(request);
    data.displayName?.trim();

    try {
      await User.updateOne(
        { _id: request.user._id },
        { displayName: data.displayName }
      );
      response.status(201).send({ displayName: data.displayName });
    } catch (err) {
      response.sendStatus(500);
    }
  }
);
export default router;
