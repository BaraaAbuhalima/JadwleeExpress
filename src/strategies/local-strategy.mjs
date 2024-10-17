import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/hash-helper.mjs";

const invalidCredentials = "Invalid Email or Password";
const verifyYourEmail = "Pleas verify Your Email First ";
passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      // console.log(`username: ${email}`);
      // console.log(`password : ${password}`);
      const findUser = await User.findOne({ email });
      
      const isAuthenticated =
        findUser && comparePassword(password, findUser.password);
      if (!isAuthenticated)
        return done(null, null, {
          message: invalidCredentials,
        });
      if (!findUser.active)
        return done(null, findUser, {
          customStatusCode: 4000,
          message: verifyYourEmail,
        });
      return done(null, findUser, {});
    } catch (err) {
      console.log(err);
      done(null, false, {
        message: invalidCredentials,
      });
    }
  })
);
