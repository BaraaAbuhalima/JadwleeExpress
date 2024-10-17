import cors from "cors";
import routes from "./routes/index.mjs";
import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import "./strategies/strategies.mjs";
import "./config/index.mjs";
const PORT = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Correctly set the origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials if needed
};

app.use(cookieParser(process.env.COOKIE));
app.use(cors(corsOptions));

// mongoose.connect(process.env.MONGO_URI).then(() => {
//   console.log("connected to database");
// });

app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    cookie: {
      maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE),
      secure: process.env.SESSION_COOKIE_SECURE == "true",
      httpOnly: false,
      sameSite: process.env.SESSION_COOKIE_SAME_SITE,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(routes);
app.listen(PORT, () => {
  console.log(`Running  on Port ${PORT}`);
});
app.get(
  "/dashboard",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (request, response) => {
    console.log(request.sessionID);
    return response.status(300).redirect("http://localhost:5173/dashboard");
  }
);

// import path from "path";
// import { fileURLToPath } from "url";
// import "./strategies/local-strategy.mjs";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "../../JadwleeReact/app/dist")));

// // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
// app.get("/signup", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../JadwleeReact/app/dist/index.html"));
// });
// export { upload };
