const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const options = { title: "SignUp" };
exports.get_sign_up = asyncHandler(async (req, res, next) => {
  res.render("signUp", options);
});

exports.post_sign_up = asyncHandler(async (req, res, next) => {
  body();
});
