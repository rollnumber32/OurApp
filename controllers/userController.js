const Follow = require("../models/Follow");
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

exports.sharedProfileData = async (req, res, next) => {
  let isVisitorsProfile = false;
  let isFollowing = false;
  if (req.session.user) {
    isVisitorsProfile = req.profileUser._id == req.session.user._id;
    isFollowing = await Follow.isVisitorFollowing(
      req.profileUser._id,
      req.session.user._id
    );
  }

  req.isVisitorsFollowing = isVisitorsProfile;
  req.isFollowing = isFollowing;

  const postCount = await Post.countPostByAuthor(req.profileUser._id);
  const followersCount = await Follow.countFollowersById(req.profileUser._id);
  const followingCount = await Follow.countFollowingById(req.profileUser._id);

  req.postCount = postCount;
  req.followerCount = followersCount;
  req.followingCount = followingCount;

  next();
};

exports.ifUserExists = (req, res, next) => {
  User.findByUsername(req.params.username)
    .then((user) => {
      req.profileUser = user;
      next();
    })
    .catch(() => {
      res.render("404");
    });
};

exports.profilePostScreen = (req, res) => {
  Post.findByAuthorId(req.profileUser._id)
    .then((posts) => {
      res.render("profile", {
        currentPage: "posts",
        posts: posts,
        profileUsername: req.profileUser.username,
        profileAvatar: req.profileUser.avatar,
        isFollowing: req.isFollowing,
        isVisitorsProfile: req.isVisitorsProfile,
        counts: {
          postCount: req.postCount,
          followerCount: req.followerCount,
          followingCount: req.followingCount,
        },
      });
    })
    .catch(() => {
      res.render("404");
    });
};

exports.profileFollowersScreen = async (req, res) => {
  try {
    const followers = await Follow.getFollowersById(req.profileUser._id).then(
      (followers) => {
        res.render("profile-followers", {
          currentPage: "followers",
          followers: followers,
          profileUsername: req.profileUser.username,
          profileAvatar: req.profileUser.avatar,
          isFollowing: req.isFollowing,
          isVisitorsProfile: req.isVisitorsProfile,
          counts: {
            postCount: req.postCount,
            followerCount: req.followerCount,
            followingCount: req.followingCount,
          },
        });
      }
    );
  } catch {
    res.render("404");
  }
};

exports.profileFollowingScreen = async (req, res) => {
  try {
    const following = await Follow.getFollowingById(req.profileUser._id).then(
      (following) => {
        res.render("profile-following", {
          currentPage: "following",
          following: following,
          profileUsername: req.profileUser.username,
          profileAvatar: req.profileUser.avatar,
          isFollowing: req.isFollowing,
          isVisitorsProfile: req.isVisitorsProfile,
          counts: {
            postCount: req.postCount,
            followerCount: req.followerCount,
            followingCount: req.followingCount,
          },
        });
      }
    );
  } catch {
    res.render("404");
  }
};
