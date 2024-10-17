import passport from "passport";
passport.serializeUser((user, done) => {
  console.log(`inside passport serializeUser`);
  console.log(user);
  done(null, user.id);
});
