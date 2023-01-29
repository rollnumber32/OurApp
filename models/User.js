const UserModel = require("../db").UserModel;
const bcrypt = require("bcryptjs");
const md5 = require("md5");
const validator = require("validator");

let User = function (data, avatarNeeded) {
  this.data = data;
  this.errors = [];
  if (avatarNeeded == undefined) avatarNeeded = false;
  if (avatarNeeded) this.generateAvatar();
};

User.prototype.cleanUp = function () {
  console.log(UserModel);
  if (typeof this.data.username != "string") this.data.username = "";
  if (typeof this.data.email != "string") this.data.email = "";
  if (typeof this.data.password != "string") this.data.password = "";

  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.username == "")
      this.errors.push("You must provide a valid username.");
    else if (!validator.isAlphanumeric(this.data.username))
      this.errors.push("Username can only contain numbers and letters.");
    if (this.data.username.length < 3)
      this.errors.push("Username must contain atleast 3 characters.");
    if (this.data.username.length > 30)
      this.errors.push("Username can contain at most 30 characters.");
    if (!validator.isEmail(this.data.email))
      this.errors.push("You must provide a valid email address.");
    if (this.data.password.length < 8)
      this.errors.push("Password must contain atleast 8 characters.");
    if (this.data.password.length > 50)
      this.errors.push("Password can contain at most 50 characters.");

    if (this.errors.length == 0) {
      let user = await UserModel.findOne({ username: this.data.username });
      if (user) this.errors.push("Username taken");
      user = await UserModel.findOne({ email: this.data.email });
      if (user) this.errors.push("Email already exists");
    }
    resolve();
  });
};

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findOne({ username: this.data.username });
    if (user && bcrypt.compareSync(this.data.password, user.password)) {
      this.data = {
        _id: user._id,
        username: user.username,
        email: user.email,
        password: this.password,
      };
      this.generateAvatar();
      resolve();
    } else {
      reject("Username or Password incorrect.");
    }
  });
};

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate();

    if (this.errors.length == 0) {
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      const user = new UserModel(this.data);
      user.save();
      this.generateAvatar();
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

User.prototype.generateAvatar = function () {
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`;
};

User.prototype.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ username: username }, (user) => {
      if (user) {
        const userDoc = new (user, true)();
        resolve(userDoc);
      } else {
        reject();
      }
    }).catch(() => reject());
  });
};

User.prototype.doesEmailExist = (email) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email: email }, (user) => {
      if (user) {
        resolve(true);
      } else {
        reject();
      }
    }).catch(() => reject());
  });
};

module.exports = User;
