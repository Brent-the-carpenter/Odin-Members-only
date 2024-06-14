const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLenght: 1, maxLenght: 60 },
  msg: { type: String, required: true, minLenght: 1, maxLenght: 200 },
  time_stamp: { type: Date, required: true },
  author: { type: Schema.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.time_stamp)
    .toUTC()
    .toLocaleString(DateTime.DATETIME_SHORT);
});
module.exports = mongoose.model("Message", MessageSchema);
