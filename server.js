const express = require("express");
const path = require("path");

PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/profile.html"));
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
