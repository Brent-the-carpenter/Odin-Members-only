#!/usr/bin/env node --env-file=/.env

const mongoose = require("mongoose");
const User = require("../models/user");
const mongoDB = process.env.MONGOURI;

mongoose.set("strictQuery", false);

async function Main() {
  mongoose.connect(mongoDB);

  console.log(`Succefully connected to Database.`);
  try {
    const giveAdmin = await User.findOneAndUpdate(
      { username: "beh337@gmail.com" },
      { status: "admin" },
      { new: true }
    );
    console.log("Update success:", giveAdmin);
  } catch (err) {
    console.log("Update failed:", err);
  } finally {
    await mongoose.connection.close();
    console.log(`Connection to Database closed.`);
  }
}

Main();
