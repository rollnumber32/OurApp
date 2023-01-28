require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.URI, { useNewURLParser: true });

mongoose.connection.once("open", () => {
  console.log("Connected to db successfully!");
  module.exports = mongoose;
  const app = require("./app");
  app.listen(3000, () => {
    console.log("Listening on 3000!");
  });
});
