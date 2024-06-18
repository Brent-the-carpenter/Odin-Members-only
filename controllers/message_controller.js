const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");

const options = { title: "Members Only", page_title: "Send a message" };
exports.get_message = asyncHandler(async (req, res, next) => {
  res.render("create_message", options);
});
exports.post_message = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 4 })
    .withMessage(
      "Please enter a descriptive title that is more than four characters."
    ),
  body("message")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Message must not be blank."),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      time_stamp: new Date(Date.now()),
      author: currentUser._id,
    });
    if (errors) {
      options.errors = errors.mapped();
      options.message = message;
      return res.render("create_message", options);
    }

    try {
      await message.save();
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { messages: message._id },
      });
      req.flash("success", "Message sent!");
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }),
];
