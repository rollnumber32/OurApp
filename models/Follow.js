const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({});

module.exports = mongoose.model("Follow", followSchema);
