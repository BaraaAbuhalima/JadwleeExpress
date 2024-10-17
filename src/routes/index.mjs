import { Router } from "express";
import signupRouter from "./signup.mjs";
import loginRouter from "./login.mjs";
import googleRouter from "./google_login.mjs";
import profileRouter from "./profile.mjs";
import logoutRouter from "./logout.mjs";
import friendRouter from "./friends.mjs";
import zajelAccountRouter from "./zajel_account.mjs";
const router = Router();
router.use(loginRouter);
router.use(signupRouter);
router.use(googleRouter);
router.use(profileRouter);
router.use(logoutRouter);
router.use(friendRouter);
router.use(zajelAccountRouter);

export default router;