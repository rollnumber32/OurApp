const express = require("express");
const app = express();
const router = require("./router");
var session = require("express-session");

app.set("view engine", "ejs");

app.use(session({ secret: "Mamma-Mia" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

module.exports = app;
