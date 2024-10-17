import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "../mongoose/schemas/user.mjs";
import { convertDisplaynameToUsername } from "../utils/login-helper.mjs";
passport.use(
  new Strategy(
    {
      clientID:
        "605829134745-r3amq88ojj7le1e0rajbp80s92hqukkp.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/dashboard",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;
        const googleID = profile._json.sub;
        const displayName = profile.displayName;
        const googlePicture = profile._json.picture;
        const username = await convertDisplaynameToUsername(displayName);
        const findUser = await User.findOne({ email: email });
        const googleStrategy = {
          id: googleID,
          picture: googlePicture,
        };
        if (findUser && !findUser.strategies.includes("Google")) {
          await User.updateOne(
            { email: email },
            {
              googleStrategy: googleStrategy,

              $addToSet: {
                strategies: "Google",
              },
            }
          );
          return done(null, findUser);
        }
        if (!findUser) {
          const user = new User({
            email,
            displayName: profile.displayName,
            googleStrategy: googleStrategy,
            username: username,
            strategies: ["Google"],
          });
          await user.save();
          return done(null, user);
        }
        done(null, findUser);
      } catch (err) {
        console.log(err);
        done(err, null, {
          message: "There was a problem ",
        });
      }
    }
  )
);
