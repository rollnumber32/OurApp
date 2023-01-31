const express = require("express");
const app = express();
const router = require("./router");
var session = require("express-session");
var flash = require("connect-flash");
const csurf = require("csurf");

sessionOptions = session({ secret: "Mamma-Mia" });

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use(flash());
app.use(sessionOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");

  res.locals.user = req.session.user;
  next();
});

app.use(csurf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/", router);

app.use((err, req, res, next) => {
  if (err) {
    if (err.code == "EBADCSRFTOKEN") {
      req.flash("errors", "Cross site request forgery detected.");
      req.session.save(() => {
        res.redirect("/");
      });
    } else {
      res.render("404");
    }
  }
});

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.use(function (socket, next) {
  sessionOptions(socket.request, socket.request.res, next);
});

io.on("connection", function (socket) {
  if (socket.request.session.user) {
    let user = socket.request.session.user;

    socket.emit("welcome", { username: user.username, avatar: user.avatar });

    socket.on("chatMessageFromBrowser", function (data) {
      socket.broadcast.emit("chatMessageFromServer", {
        message: data.message,
        username: user.username,
        avatar: user.avatar,
      });
    });
  }
});

module.exports = server;
