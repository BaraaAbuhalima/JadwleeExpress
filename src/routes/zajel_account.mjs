import { Router } from "express";
import {
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware,
} from "../utils/middlewares.mjs";
import { matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import {
  zajelIdSchema,
  zajelPasswordSchema,
} from "../utils/validationSchemas.mjs";
const router = Router();
router.post(
  "/api/user/zajel/password",
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware(zajelPasswordSchema),
  async (request, response) => {
    const data = matchedData(request);
    try {
      await User.updateOne(
        { _id: request.user._id },
        {
          zajelPassword: data.zajelPassword,
        }
      );
    } catch (err) {
      return response.sendStatus(500);
    }

    return response.status(200).send(["Password Changed Successfully"]);
  }
);
router.post(
  "/api/user/zajel/id",
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware(zajelIdSchema),
  async (request, response) => {
    const data = matchedData(request);
    try {
      await User.updateOne(
        { _id: request.user._id },
        {
          zajelID: data.zajelID,
        }
      );
    } catch (err) {
      return response.sendStatus(500);
    }

    return response.status(200).send(["Zajel Id Changed Successfully"]);
  }
);
export default router;
