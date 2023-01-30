const { ObjectId } = require("mongodb");
const { PostModel, FollowModel } = require("../db");
const User = require("./User");

let Post = function (data, userid, requestedPostId) {
  this.data = data;
  this.userid = userid;
  this.errors = [];
  this.requestedPostId = requestedPostId;
};

Post.prototype.cleanUp = function () {
  if (typeof this.data.title != "string") this.data.title = "";
  if (typeof this.data.body != "string") this.data.body = "";

  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdAt: new Date(),
    authorId: ObjectId(this.userid),
  };
};

Post.prototype.validate = function () {
  if (this.data.title == "") this.errors.push("Title can not be empty");
  if (this.data.body == "") this.errors.push("Body can not be empty");
};

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (this.errors.length == 0) {
      const post = new PostModel(this.data);
      post.save((err, p) => {
        resolve(p._id);
      });
    } else {
      reject(this.errors);
    }
  });
};

Post.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findSingleById(this.requestedPostId, this.userid);
      if (post.isVisitorOwner) {
        const status = await this.actuallyUpdate();
        resolve(status);
      } else {
        reject();
      }
    } catch {
      reject();
    }
  });
};

Post.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (this.errors.length == 0) {
      await PostModel.findOneAndUpdate(
        { _id: new ObjectId(this.requestedPostId) },
        { $set: { title: this.data.title, body: this.data.body } }
      );
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};

Post.reusablePostQuery = function (uniqueOps, visitorId) {
  return new Promise(async (resolve, reject) => {
    const aggregatedOperations = uniqueOps.concat([
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDocument",
        },
      },
      {
        $project: {
          title: 1,
          body: 1,
          createdAt: 1,
          authorId: "$authorId",
          author: { $arrayElemAt: ["$authorDocument", 0] },
        },
      },
    ]);

    const posts = await PostModel.aggregate(aggregatedOperations);

    posts.map((post) => {
      post.isVisitorOwner = post.authorId == visitorId;
      post.authorId = undefined;

      post.author = {
        username: post.author.username,
        avatar: new User(post.author, true).avatar,
      };
      return post;
    });

    resolve(posts);
  });
};

Post.findSingleById = function (id, visitorId) {
  return new Promise(async (resolve, reject) => {
    if (!ObjectId.isValid(id) || typeof id != "string") {
      reject();
    }

    const posts = await Post.reusablePostQuery(
      [{ $match: { _id: new ObjectId(id) } }],
      visitorId
    );

    if (posts.length > 0) {
      resolve(posts[0]);
    } else {
      reject();
    }
  });
};

Post.delete = function (postId, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.findSingleById(postId, currentUserId);
      if (post.isVisitorOwner) {
        await PostModel.deleteOne({ _id: new ObjectId(postId) });
        resolve();
      } else {
        reject();
      }
    } catch {
      reject();
    }
  });
};

Post.search = function (searchTerm) {
  return new Promise(async (resolve, rejetc) => {
    if (typeof searchTerm == "string") {
      const posts = await Post.reusablePostQuery[
        ({ $match: { $text: { $search: searchTerm } } },
        { $sort: { $score: { $meta: "textScore" } } })
      ];
    } else {
      reject();
    }
  });
};

Post.findByAuthorId = (id) => {
  return Post.reusablePostQuery([
    { $match: { authorId: id } },
    { $sort: { createdAt: -1 } },
  ]);
};

Post.countPostByAuthor = (id) => {
  return new Promise(async (resolve, reject) => {
    const postCount = await PostModel.countDocuments({ authorId: id });
    resolve(postCount);
  });
};

Post.getFeed = async function (id) {
  const followedUsers = await FollowModel.find({
    authorId: new ObjectId(id),
  });

  followedUsers.map((followDoc) => {
    return followDoc.followedId;
  });

  return Post.reusablePostQuery([
    { $match: { authorId: { $in: followedUsers } } },
    { $sort: { createdAt: -1 } },
  ]);
};

module.exports = Post;
