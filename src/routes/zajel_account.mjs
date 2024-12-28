import { Router } from "express";
import {
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware,
} from "../utils/middlewares.mjs";
import { matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import {
  zajelIDSchema,
  zajelPasswordSchema,
} from "../utils/validationSchemas.mjs";
const router = Router();

router.post(
  "/api/user/zajel",
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware(zajelIDSchema),
  checkSchemaMiddleware(zajelPasswordSchema),
  async (request, response) => {
    const data = matchedData(request);
    try {
      await User.updateOne(
        { _id: request.user._id },
        {
          zajelID: data.zajelID,
          zajelPassword: data.zajelPassword,
        }
      );
    } catch (err) {
      return response.sendStatus(500);
    }

    return response
      .status(200)
      .send(["Zajel Id & Password Changed Successfully"]);
  }
);
router.get(
  "/api/user/zajel",
  checkIsAuthenticatedMiddleware,
  (request, response) => {
    const user = request.user;
    return response
      .status(200)
      .send({ zajelID: user.zajelID, zajelPassword: user.zajelPassword });
  }
);
export default router;
