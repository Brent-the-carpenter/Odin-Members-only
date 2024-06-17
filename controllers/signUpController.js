const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debugSignUp = require("debug")("app:signUp");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const user = require("../models/user");

const options = { title: "SignUp", user: null };
exports.get_sign_up = asyncHandler(async (req, res, next) => {
  console.log(options);
  res.render("signup_form", {
    page: "Sign Up",
    title: options.title,
    user: null,
    errors: {},
  });
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
  body("password")
    .trim()
    .escape()
    .isLength({ min: 10 })

    .isStrongPassword().withMessage(`Password must contain:
      10 characters,
      1 uppercase character,
      1 lowercase character,
      1 number,
      1 special character (e.g., $,.,@)`),
  body("password_confirm", "Please confirm your password.").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const userInfo = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      console.log(errors);
      options.errors = errors.mapped();
      options.user = userInfo;
      return res.render("signup_form", options);
    }

    try {
      const isUser = await User.find({ username: req.body.username }).exec();
      if (isUser.length > 0) {
        options.userTaken = "A account with this username already exsist.";
        options.user = userInfo;
        options.errors = errors.mapped();
        return res.render("signup_form", options);
      }
      if (req.body.password !== req.body.password_confirm) {
        options.password_match = false;
        options.user = userInfo;
        // map errors so we can use propertys to have errors display under each corrosponding input.
        options.errors = errors.mapped();
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
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      });
    } catch (error) {
      debugSignUp("debugSignUp: error signing up error:", error);
      return next(error);
    }
  }),
];
