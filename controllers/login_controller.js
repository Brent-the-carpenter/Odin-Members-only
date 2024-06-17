const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const passport = require("../config/passportConfig");

const options = { title: "Login", user: {} };
exports.get_login = asyncHandler(async (req, res, next) => {
  res.render("login_form", options);
});

exports.post_login = [
  body("username", "username is required").trim().escape(),
  body("password", "Password is required").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      options.errors = errors.array();
      return res.render("login_form", options);
    }

    // passport options {onFailure  , on success} don't work in route handler need to use callback instead.
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        options.errors = [{ msg: info.message }];
        return res.render("login_form");
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    })(req, res, next);
  }),
];
