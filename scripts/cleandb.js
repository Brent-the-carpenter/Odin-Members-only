const mongoose = require("mongoose");
const User = require("../models/user");

const mongoDB = process.env.MONGOURI;
mongoose.set("strictQuery", false);

async function main() {
  (async function connect() {
    try {
      await mongoose.connect(mongoDB);
      console.log(`mongoDB: connected`);
    } catch (err) {
      console.log(err);
    }
    await User.deleteMany({}).exec();
    console.log("deleted all users");
    mongoose.connection.close();
  })();
}
