const express = require("express");
const router = express.Router();
const signup_Controller = require("../controllers/signUpController");
const login_controller = require("../controllers/login_controller.js");
const logout_controller = require("../controllers/logout_controller");
const secret_controller = require("../controllers/secret_controller");
const message_controller = require("../controllers/message_controller");
const ensureAuthenticated = require("../middleware/authenticate.js");
/*sign up routes */
router.get("/signup", signup_Controller.get_sign_up);
router.post("/signup", signup_Controller.post_sign_up);

/*login in routes */
router.get("/login", login_controller.get_login);
router.post("/login", login_controller.post_login);

/* logout routes */
router.get("/logout", logout_controller.get_logout);

/*secret question routes*/
router.get(
  "/becomeMember",
  ensureAuthenticated,
  secret_controller.get_secret_form
);
router.post(
  "/becomeMember",
  ensureAuthenticated,
  secret_controller.post_secret_form
);

/* message routes */
router.get("/message", ensureAuthenticated, message_controller.get_message);
router.post("/message", ensureAuthenticated, message_controller.post_message);

/* Delete message */
router.post(
  "/deleteMessage",
  ensureAuthenticated,
  message_controller.post_delete_message
);

module.exports = router;
