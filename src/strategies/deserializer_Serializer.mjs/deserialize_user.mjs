import passport from "passport";
import { User } from "../../mongoose/schemas/user.mjs";
passport.deserializeUser(async (id, done) => {
  console.log(`inside passport deserializeUser`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("user is not found ");
    done(null, findUser);
  } catch (err) {
    done(null, null);
  }
});
