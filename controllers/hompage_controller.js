const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
exports.get_hompage = asyncHandler(async (req, res, next) => {
  const options = { title: "Members Only" };
  const today = new Date();
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(today.getDate() - 5);
  options.messages = await Message.find({
    time_stamp: { $gte: fiveDaysAgo, $lte: today },
  })
    .populate("author")
    .exec();
  res.render("index", options);
});
