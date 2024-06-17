const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");

const Strategy = new LocalStrategy(async (username, password, done) => {
  try {
    console.log(username);
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
passport.use(Strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
