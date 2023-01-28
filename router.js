const path = require("path");
const express = require("express");
const router = express.Router();

const user_controller = require("./controllers/userController");
const post_controller = require("./controllers/postController");
const follow_controller = require("./controllers/followController");

router.get("/", (req, res) => {
  if (user_controller.isLoggedIn()) {
    res.render(path.join(__dirname, "/views/home-dashboard.ejs"));
  } else {
    res.render(path.join(__dirname, "/views/home-guest.ejs"));
  }
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/api/users", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

/*

router.get("/profile/", (req, res) => {
  res.render(path.join(__dirname, "/views/profile.ejs"));
});

router.get("/profile-followers", (req, res) => {
  res.render(path.join(__dirname, "/views/profile-followers.ejs"));
});

router.get("/profile-following", (req, res) => {
  res.render(path.join(__dirname, "/views/profile-following.ejs"));
});

router.get("/create-post", (req, res) => {
  res.render(path.join(__dirname, "/views/create-post.ejs"));
});

router.get("/single-post-screen", (req, res) => {
  res.render(path.join(__dirname, "/views/single-post-screen.ejs"));
});
*/

module.exports = router;
