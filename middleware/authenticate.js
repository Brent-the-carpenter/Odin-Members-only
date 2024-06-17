function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "you must be logged in to view this page.");
    res.redirect("/user/login");
  }
}

module.exports = ensureAuthenticated;
