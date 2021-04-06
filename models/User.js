const { mockServer } = require("graphql-tools");
const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  fullname: String,
  email: String,
  createdAt: String,
  watchlist: Array,
});

module.exports = model("User", userSchema);
