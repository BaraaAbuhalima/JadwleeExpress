import { Router } from "express";
import passport from "passport";
const router = Router();
router.get(
  "/api/auth/google",
  passport.authenticate("google"),
  (request, response) => {
    console.log("inside auth");
    console.log(request.user);
    response.status(200).send("google");
  }
);
/////gonna replace it later
// router.get("/signup", passport.authenticate("google"), (request, response) => {
//   console.log(request.session);
//   console.log(request.user);
//   return request.user
//     ? response.status(200).redirect("http://localhost:5173/dashboard")
//     : response.status(401).send("http://localhost:5173/dashboard ");
// });
export default router;
