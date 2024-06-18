const express = require("express");
const router = express.Router();
const homepage_controller = require("../controllers/hompage_controller");

/* GET home page. */
router.get("/", homepage_controller.get_hompage);

module.exports = router;
