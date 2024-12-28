import Router from "express";
import { checkIsAuthenticatedMiddleware } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
const router = Router();
router.get(
  "/api/user/schedule/:userNumber",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const userNumber = request.params.userNumber;
    let findFriend;
    try {
      findFriend = await User.findOne({ userNumber: userNumber });
      if (!findFriend) throw new Error();
      console.log(request.user.friends[findFriend.id]);
      if (
        request.user.id !== findFriend.id &&
        request.user.friends[findFriend.id] !== "F"
      )
        throw new Error();
    } catch (err) {
      console.log(err);
      return response.sendStatus(500);
    }
    return response.status(200).send({
      zajelID: findFriend.zajelID,
      zajelPassword: findFriend.zajelPassword,
    });
  }
);
export default router;
