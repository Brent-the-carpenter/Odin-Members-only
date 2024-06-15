const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debugSignUp = require("debug")("app:signUp");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const options = { title: "SignUp" };
exports.get_sign_up = asyncHandler(async (req, res, next) => {
  res.render("signup_form", options);
});

exports.post_sign_up = [
  body("first_name", " First name is required.")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Must be at least one character long.")
    .isAlpha()
    .withMessage("Must contain only Alpha characters."),
  body("last_name", "Last name is required.")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Must be at least one character long."),
  body("username", "Username is required.").trim().escape(),
  body("password", "Password is required.").trim().escape().isStrongPassword(),
  body("password_confirm", "Please confirm your password.").trim().escape(),
  asyncHandler(async (req, res, next) => {
    try {
      const isUser = await User.find({ username: req.body.username }).exec();
      if (isUser) {
        options.userTaken = "A account with this username already exsist.";
        return res.render("signup_form", options);
      }
      if (req.body.password !== req.body.password_confirm) {
        options.password_match = false;
        return res.render("signup_form", options);
      }
      bcrypt.hash(req.body.password, 10, async (err, hashedpassword) => {
        if (err) {
          const err = new Error("Error hashing password");
          err.status = 500;
          err.stack = err;
          throw err;
        }
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedpassword,
        });
        debugSignUp(`saved user: ${user}`);
        await user.save();
        res.redirect("/");
      });
    } catch (error) {
      debugSignUp("debugSignUp: error signing up error:", error);
      return next(error);
    }
  }),
];
