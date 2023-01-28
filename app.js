const express = require("express");
const app = express();
const path = require("path");
const router = require("./router");
app.set("view engine", "ejs");

app.use("/", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
