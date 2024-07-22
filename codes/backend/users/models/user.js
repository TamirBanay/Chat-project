// server/users/model/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userid: Number,
  email: String,
  username: String,
  password: String,
  phonNumber: String,
  userStatus: {
    type: String,
    enum: ["Connected", "disConnected"],
    default: "disConnected",
  },
  chatId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
});

module.exports = mongoose.model("User", userSchema);
