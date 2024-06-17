const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const options = { title: "Members Only", page_title: "Members Secret" };
(exports.get_secret_form = asyncHandler(async (req, res, next) => {
  res.render("secret_form", options);
})),
  (exports.post_secret_form = [
    body("answer")
      .trim()
      .escape()
      .custom((value) => {
        if (!isPassword(value)) {
          throw new Error("Incorrect answer");
        }
        return true;
      })
      .isLength({ min: 5, max: 12 })
      .withMessage("The answer is between 5 and 12 characters."),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        options.errors = errors.array();
        return res.render("secret_form", options);
      }
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { status: "member" },
        { new: true }
      );
      if (!user) {
        const error = new Error(
          "Sorry we are having trouble on our side. Please try again."
        );
        error.status = 500;
        error.stack = console.error(
          `User: ${req.user} is authenticated , but not found in db`,
          500
        );
        throw error;
      }
      await user.save();
      req.flash("success", `${user.first_name} you are a member now!`);
      res.redirect("/");
    }),
  ]);

function isPassword(answer) {
  const lowercaseAnswer = answer.toLowerCase();
  const match = lowercaseAnswer === process.env.MEMBERSSECRET.toLowerCase();
  return match;
}
