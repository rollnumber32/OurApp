const path = require("path");
const express = require("express");
const router = express.Router();

const user_controller = require("./controllers/userController");
const post_controller = require("./controllers/postController");
const follow_controller = require("./controllers/followController");

router.get("/", user_controller.home);
router.post("/login", user_controller.login);
router.post("/signup", user_controller.signup);

module.exports = router;
