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
    console.log("req body:", req.body);
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      time_stamp: new Date(Date.now()),
      author: req.user._id,
    });
    if (!errors.isEmpty()) {
      options.errors = errors.mapped();
      options.message = message;
      return res.render("create_message", options);
    }

    try {
      const newMessage = await message.save();
      await User.findByIdAndUpdate(req.user._id, {
        $push: { messages: newMessage._id },
      });
      req.flash("success", "Message sent!");
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }),
];

exports.post_delete_message = asyncHandler(async (req, res, next) => {
  if (!req.body.message_id) {
    const error = new Error("Message Not found");
    error.status = 400;
    error.stack = console.error("Message delete form did not submit id.");
    return next(error);
  }
  try {
    const deletedMessage = await Message.findByIdAndDelete(
      req.body.message_id
    ).exec();
    if (!deletedMessage) {
      const error = new Error("Message not found");
      error.status = 404;
      return next(error);
    }
    const updatedUserMessages = await User.findByIdAndUpdate(
      deletedMessage.author,
      { $pull: { messages: deletedMessage._id } },
      { new: true }
    ).exec();
    console.log(`Updated user messages ${updatedUserMessages}`);
    req.flash("success", `Succesfully deleted ${deletedMessage._id} `);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting message:", err);
  }
});
