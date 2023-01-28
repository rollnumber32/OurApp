require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.URI, { useNewURLParser: true });

mongoose.connection
  .once("open", function () {
    console.log("Database connected Successfully");
  })
  .on("error", function (err) {
    console.log("Error", err);
  });
