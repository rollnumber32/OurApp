const Follow = require("../models/Follow");

exports.addFollow = (req, res) => {
  const follow = new Follow(req.params.username, req.session.user._id);
  follow
    .create()
    .then(() => {
      req.flash("success", `Successfully followed ${req.params.username}`);
      req.session.save(() => {
        res.redirect(`/profile/${req.params.username}`);
      });
    })
    .catch((errors) => {
      errors.forEach((error) => {
        req.flash("errors", error);
      });
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.removeFollow = (req, res) => {
  const follow = new Follow(req.params.username, req.session.user._id);
  follow
    .delte()
    .then(() => {
      req.flash("success", `Successfully unfollowed ${req.params.username}`);
      req.session.save(() => {
        res.redirect(`/profile/${req.params.username}`);
      });
    })
    .catch((errors) => {
      errors.forEach((error) => {
        req.flash("errors", error);
      });
      req.session.save(() => {
        res.redirect("/");
      });
    });
};
