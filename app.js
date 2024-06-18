/* Package imports */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const debug = require("debug")("app:app");
const helmet = require("helmet");
const compression = require("compression");
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const debugDB = require("debug")("app:db");

const passport = require("./config/passportConfig");
const flash = require("connect-flash");
/* Route imports */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const session = require("express-session");

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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// set up express session needs a store for session's or they wont persist when server is restarted.
app.use(
  session({
    secret: Secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      collectionName: "Sessions",
      mongoUrl: MongoDB,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
      sameSite: "strict",
    },
  })
);
app.use(passport.session());
app.use(flash());
app.use(helmet());
app.use(Limiter);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

// Setup passport

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
// Setup flash  to save messages to locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success");
  res.locals.error_messages = req.flash("error");
  next();
});

// Debugging middleware to log res.locals
app.use((req, res, next) => {
  debug("res.locals:", res.locals);

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
