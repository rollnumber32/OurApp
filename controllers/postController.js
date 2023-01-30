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
    res.render("404");
  }
};

exports.viewEditScreen = async (req, res) => {
  try {
    const post = await Post.findSingleById(req.params.id, req.session.user._id);
    if (post.isVisitorOwner) {
      res.render("edit-post", { post: post });
    } else {
      req.flash("errors", "You do not have permission to perform this action.");
      req.session.save(() => {
        res.redirect("/");
      });
    }
  } catch {
    res.render("404");
  }
};

exports.create = (req, res) => {
  const post = new Post(req.body, req.session.user._id);
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

exports.edit = (req, res) => {
  const post = new Post(req.body, req.session.user._id, req.params.id);
  post
    .update()
    .then((status) => {
      if (status == "success") {
        req.flash("success", "Post updated successfully.");
        req.session.save(() => {
          res.redirect(`/post/${req.params.id}`);
        });
      } else {
        post.errors.forEach((error) => {
          req.flash("errors", error);
        });
      }
    })
    .catch(() => {
      req.flash("errors", "You do not have permission to perform this action.");
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.delete = (req, res) => {
  Post.delete(req.params.id, req.session.user._id)
    .then(() => {
      req.flash("success", "Post deleted successfully.");
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch(() => {
      req.flash("errors", "You do not have permission to perform that action.");
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.search = (req, res) => {
  Post.search(req.body.searchTerm)
    .then((posts) => {
      res.json(posts);
    })
    .catch(() => {
      res.json([]);
    });
};
