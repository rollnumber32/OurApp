const path = require("path");
const express = require("express");
const router = express.Router();

const user_controller = require("./controllers/userController");
const post_controller = require("./controllers/postController");
const follow_controller = require("./controllers/followController");

//user
router.get("/", user_controller.home);
router.get("/signout", user_controller.signout);
router.post("/login", user_controller.login);
router.post("/signup", user_controller.signup);

//profile
router.get(
  "/profile/:username",
  user_controller.ifUserExists,
  user_controller.sharedProfileData,
  user_controller.profilePostScreen
);
router.get(
  "/profile/:username/followers",
  user_controller.ifUserExists,
  user_controller.sharedProfileData,
  user_controller.profileFollowersScreen
);
router.get(
  "/profile/:username/following",
  user_controller.ifUserExists,
  user_controller.sharedProfileData,
  user_controller.profileFollowingScreen
);

//post
router.get(
  "/create-post",
  user_controller.mustBeLoggedIn,
  post_controller.viewPostScreen
);
router.post(
  "/create-post",
  user_controller.mustBeLoggedIn,
  post_controller.create
);
router.get("/post/:id", post_controller.viewSingle);
router.get(
  "/post/:id/edit",
  user_controller.mustBeLoggedIn,
  post_controller.viewEditScreen
);
router.post(
  "/post/:id/edit",
  user_controller.mustBeLoggedIn,
  post_controller.edit
);
router.get(
  "/post/:id/delete",
  user_controller.mustBeLoggedIn,
  post_controller.delete
);
router.post("/search", post_controller.search);

module.exports = router;
