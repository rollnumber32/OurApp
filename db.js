require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.URI, { useNewURLParser: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema);

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  authorId: { type: mongoose.Types.ObjectId },
});

const PostModel = mongoose.model("Post", postSchema);

const followSchema = new mongoose.Schema({});

const FollowModel = mongoose.model("Follow", followSchema);

module.exports = {
  PostModel,
  UserModel,
  FollowModel,
};

mongoose.connection.once("open", () => {
  console.log("Connected to db successfully!");
  const app = require("./app");
  app.listen(3000, () => {
    console.log("Listening on 3000!");
  });
});
