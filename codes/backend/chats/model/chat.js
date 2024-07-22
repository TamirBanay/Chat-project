// server/chats/model/chat.js
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const chatSchema = new mongoose.Schema({
  chatId: { type: Number, unique: true },
  userId1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

chatSchema.plugin(AutoIncrement, { inc_field: "chatId" });

chatSchema.index({ userId1: 1, userId2: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
