const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 1 },
  last_name: { type: String, required: true, minLength: 1 },
  username: { type: String, required: true, maxLength: 30, minLenght: 3 },
  password: { type: String, required: true, minLength: 10 },
  status: { type: String, enum: ["user", "member", "admin"], default: "user" },
});

UserSchema.virtual("fullname").get(function () {
  return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model("User", UserSchema);
