const db = require("./db");
const express = require("express");
const app = express();
const path = require("path");
app.set("view engine", "ejs");

app.get("/profile", (req, res) => {
  res.render(path.join(__dirname, "/views/profile.ejs"));
  db.connectToServer(() => console.log("Hola!"));
});

app.get("/profile-followers", (req, res) => {
  res.render(path.join(__dirname, "/views/profile-followers.ejs"));
});

app.get("/profile-following", (req, res) => {
  res.render(path.join(__dirname, "/views/profile-following.ejs"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
