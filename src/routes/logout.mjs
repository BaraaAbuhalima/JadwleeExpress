import { Router } from "express";
import { checkIsAuthenticatedMiddleware } from "../utils/middlewares.mjs";
const router = Router();

router.get(
  "/api/user/logout",
  checkIsAuthenticatedMiddleware,
  (request, response) => {
    request.session.destroy();
    request.logout(() => {});
    response.clearCookie(process.env.SESSION_NAME, {
      path: "/",
      secure: process.env.SESSION_COOKIE_SECURE === "true",
      httpOnly: process.env.HTTP_ONLY === "true",
      sameSite: process.env.SESSION_COOKIE_SAME_SITE,
    });

    return response.sendStatus(200);
  }
);
export default router;
