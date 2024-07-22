// server/users/model/user.js
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  email: { type: String, unique: true, required: true },
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

userSchema.plugin(AutoIncrement, { inc_field: "userid" });

userSchema.index({ email: 1 }, { unique: true }); // Ensure the unique index on email

const User = mongoose.model("User", userSchema);
User.ensureIndexes(); // Ensure indexes are created

module.exports = User;
