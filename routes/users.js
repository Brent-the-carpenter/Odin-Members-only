const express = require("express");
const router = express.Router();
const signup_Controller = require("../controllers/signUpController");
/* GET users listing. */
router.get("/signup", signup_Controller.get_sign_up);
router.post("/signup", signup_Controller.post_sign_up);

module.exports = router;
