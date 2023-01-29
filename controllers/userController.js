const User = require("../models/User");

exports.home = (req, res) => {
  if (req.session.user) {
    res.render("home-dashboard");
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
        avatar: user.data.avatar,
      };
      req.session.save(() => res.redirect("/"));
    })
    .catch((e) => {
      req.flash("errors", e);
      req.session.save(() => res.redirect("/"));
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
  req.session.destroy(() => res.redirect("/"));
};
