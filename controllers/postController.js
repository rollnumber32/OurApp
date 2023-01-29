const Post = require("../models/Post");

exports.viewPostScreen = (req, res) => {
  res.render("./create-post");
};

exports.viewSingle = async (req, res) => {
  try {
    const post = await Post.findSingleById(
      req.params.id,
      req.session.user ? req.session.user._id : undefined
    );
    res.render("single-post-screen", { post: post });
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

exports.viewEditScreen = (req, res) => {};

exports.create = (req, res) => {
  const post = new Post(req.body, req.session.user._id);
  console.log(req.session.user);
  post
    .create()
    .then((newId) => {
      req.flash("success", "New post successfully created");
      req.session.save(() => res.redirect(`/post/${newId}`));
    })
    .catch((errors) => {
      errors.forEach((e) => req.flash("errors", e));
      req.session.save(() => res.redirect("/create-post"));
    });
};

exports.edit = (req, res) => {};

exports.delete = (req, res) => {};

exports.search = (req, res) => {};
