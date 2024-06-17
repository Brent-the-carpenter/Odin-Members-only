const asyncHandler = require("express-async-handler");

exports.get_logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        next(err);
      }
    });
    res.redirect("/user/login");
  });
});
