import { Router } from "express";
import { checkIsAuthenticatedMiddleware } from "../utils/middlewares.mjs";
import { filterFriends } from "../utils/friends_helper.mjs";
const router = Router();
router.get(
  "/api/user/zajel/friend",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const user = request.user;
    const friends = await filterFriends(user, "F", [
      "username",
      "zajelID",
      "zajelPassword",
      "displayName",
    ]);
    return response.status(200).send(friends);
  }
);
router.get(
  "/api/user/zajel/me",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const user = request.user;
    const me = {
      zajelID: user.zajelID,
      password: user.zajelPassword,
      username: user.username,
    };
    return response.status(200).send(me);
  }
);
/////////////////////////
export default router;
