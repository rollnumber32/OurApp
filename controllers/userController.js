const Post = require("../models/Post");
const User = require("../models/User");

exports.home = async (req, res) => {
  if (req.session.user) {
    const posts = await Post.getFeed(req.session.user._id);
    res.render("home-dashboard", { posts: posts });
  } else {
    res.render("home-guest");
  }
};

exports.login = (req, res) => {
  const user = new User(req.body);
  user
    .login()
    .then(() => {
      req.session.user = {
        _id: user.data._id,
        username: user.data.username,
        avatar: user.avatar,
      };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((e) => {
      req.flash("errors", e);
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  user.register();
  res.redirect("/");
};

exports.signout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.mustBeLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};
