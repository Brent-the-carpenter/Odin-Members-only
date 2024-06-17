const asyncHandler = require("express-async-handler");

exports.get_logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // destroy session so user is not logged in when revisiting.
    req.session.destroy((err) => {
      if (err) {
        next(err);
      }
    });
    res.redirect("/user/login");
  });
});
