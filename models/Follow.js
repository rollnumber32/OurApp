const { ObjectId } = require("mongodb");
const { UserModel, FollowModel } = require("../db");
const User = require("./User");

let Follow = function (followedUsername, authorId) {
  this.followedUsername = followedUsername;
  this.authorId = authorId;
  this.errors = [];
};

Follow.prototype.cleanUp = function () {
  if (typeof this.followedUsername != "string") this.followedUsername = "";
};

Follow.prototype.validate = async function (action) {
  const followedAccount = await UserModel.findOne({
    username: this.followedUsername,
  });
  if (followedAccount) {
    this.followId = followedAccount._id;
  } else {
    this.errors.push("You can't follow a user that do not exist");
  }

  const doesFollowAlreadyExist = await FollowModel.findOne({
    followedId: this.followId,
    authorId: new ObjectId(this.authorId),
  });

  if (action == "create") {
    if (doesFollowAlreadyExist)
      this.errors.push("You are already following this user.");
  }

  if (action == "delete") {
    if (!doesFollowAlreadyExist)
      this.errors.push("You can't unfollow a user you do not already follow.");
  }

  if (this.followId == this.authorId)
    this.errors.push("You can't follow yourself");
};

Follow.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate("create");
    if (this.errors == 0) {
      const follow = new FollowModel({
        followedId: this.followId,
        authorId: new ObjectId(this.authorId),
      });
      follow.save();
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

Follow.prototype.delete = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate("delete");
    if (this.errors == 0) {
      await FollowModel.deleteOne({
        followedId: this.followId,
        authorId: new ObjectId(this.authorId),
      });
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

Follow.isVisitorFollowing = async (followedId, visitorId) => {
  const follow = await FollowModel.findOne({
    followedId: followedId,
    authorId: new ObjectId(visitorId),
  });
  if (follow) {
    return true;
  } else {
    return false;
  }
};

Follow.getFollowersById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followers = await FollowModel.aggregate([
        { $match: { followedId: id } },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "userDoc",
          },
        },
        {
          $project: {
            username: { $arrayElemAt: ["$userDoc.username", 0] },
            email: { $arrayElemAt: ["$userDoc.email", 0] },
          },
        },
      ]);
      followers.map((follower) => {
        const user = new User(follower, true);
        return { username: user.username, avatar: user.avatar };
      });
      resolve(followers);
    } catch {
      reject();
    }
  });
};

Follow.getFollowingById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const following = await FollowModel.aggregate([
        { $match: { authorId: id } },
        {
          $lookup: {
            from: "users",
            localField: "followedId",
            foreignField: "_id",
            as: "userDoc",
          },
        },
        {
          $project: {
            username: { $arrayElemAt: ["$userDoc.username", 0] },
            email: { $arrayElemAt: ["$userDoc.email", 0] },
          },
        },
      ]);
      following.map((follower) => {
        const user = new User(follower, true);
        return { username: user.username, avatar: user.avatar };
      });
      resolve(following);
    } catch {
      reject();
    }
  });
};

Follow.countFollowersById = (id) => {
  return new Promise(async (resolve, reject) => {
    const count = await FollowModel.countDocuments({ followedId: id });
    resolve(count);
  });
};

Follow.countFollowingById = (id) => {
  return new Promise(async (resolve, reject) => {
    const count = await FollowModel.countDocuments({ authorId: id });
    resolve(count);
  });
};

module.exports = Follow;
