const asyncHandler = require("express-async-handler");
const passport = require("../config/passportConfig");
const options = { title: "Members Only", page_title: "Members Secret" };
(exports.get_secret_form = asyncHandler(async (req, res, next) => {
  res.render("secret_form", options);
})),
  (exports.post_secret_form = [asyncHandler(async (req, res, next) => {})]);
