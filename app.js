const express = require("express");
const app = express();
const router = require("./router");
var session = require("express-session");
var flash = require("connect-flash");

app.set("view engine", "ejs");

app.use(flash());
app.use(session({ secret: "Mamma-Mia" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");

  res.locals.user = req.session.user;
  next();
});

app.use("/", router);

module.exports = app;
