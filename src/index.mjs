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
import path from "path";
import { fileURLToPath } from "url";
const PORT = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: ["https://localhost:5123", "https://127.0.0.1:5500"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cookieParser(process.env.COOKIE));
app.use(cors(corsOptions));

app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    cookie: {
      // maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(routes);

// app.get(
//   "/dashboard",
//   passport.authenticate("google", {
//     failureRedirect: "http://localhost:5173/login",
//   }),
//   (request, response) => {
//     console.log(request.sessionID);
//     return response.status(200).send("dfsf");
//   }
// );

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../../app/dist")));

// Fallback for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../app/dist", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Running  on Port ${PORT}`);
});
