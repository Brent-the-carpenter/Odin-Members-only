/* Package imports */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressEjsLayouts = require("express-ejs-layouts");
const helmet = require("helmet");
const compression = require("compression");
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const debugDB = require("debug")("app:db");
const passport = require("passport");
const passportConfig = require("./config/passportConfig");

/* Route imports */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const session = require("express-session");

/* Model imports */
const User = require("./models/user");

const Secret = process.env.SECRET;
const MongoDB = process.env.MONGOURI;
const Limiter = RateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 500,
});

const app = express();

// Set up Mongo
mongoose.set("strictQuery", false);
async function main() {
  await mongoose.connect(MongoDB);
  debugDB("MongoDB: successfully connected to DB");
}
main().catch((err) => debugDB(err));

// View engine setup
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(session({ secret: Secret, resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(helmet());
app.use(Limiter);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

// Setup passport
passport.use(passportConfig);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Debugging middleware to log res.locals
app.use((req, res, next) => {
  console.log("res.locals:", res.locals);
  next();
});

app.use("/", indexRouter);
app.use("/user", usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
