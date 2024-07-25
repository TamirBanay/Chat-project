// server/users/model/user.js
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  email: { type: String, unique: true, required: true },
  username: String,
  password: String,
  phonNumber: { type: String, unique: true, required: true },
  userStatus: {
    type: String,
    enum: ["Connected", "disConnected"],
    default: "disConnected",
  },
  gender: {
    type: String,
    enum: ["female", "male", "other"],
    default: "other",
  },
  chatId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
});

userSchema.plugin(AutoIncrement, { inc_field: "userid" });

userSchema.index({ email: 1 }, { unique: true }); 

const User = mongoose.model("User", userSchema);
User.ensureIndexes(); 

module.exports = User;
