import { Router } from "express";
import {
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware,
} from "../utils/middlewares.mjs";
import { zajelNameSchema } from "../utils/validationSchemas.mjs";
import { matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
const router = Router();
router.post(
  "/api/user/realName",
  checkIsAuthenticatedMiddleware,
  checkSchemaMiddleware(zajelNameSchema),
  async (request, response) => {
    const { realName } = matchedData(request);
    try {
      console.log(
        await User.updateOne(
          { _id: request.user._id },
          {
            realName: realName,
          }
        )
      );
      response.sendStatus(200);
    } catch (err) {
      console.log(err);
      response.sendStatus(500);
    }
  }
);
export default router;
