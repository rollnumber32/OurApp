const User = require("../models/User");

exports.home = (req, res) => {
  res.render("home-guest");
};

exports.login = (req, res) => {
  const user = new User(req.body);
  user.login();
};

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  user.save();
};
