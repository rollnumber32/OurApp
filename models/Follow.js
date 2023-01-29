const { UserModel, FollowModel } = require("../db");

let Follow = function (followedUsername, authorId) {
  this.followedUsername = followedUsername;
  this.authorId = authorId;
  this.errors = [];
};

Follow.cleanUp = function () {
  if (typeof this.followedUsername != "string") this.followedUsername = "";
};

Follow.validate = async function (action) {};
