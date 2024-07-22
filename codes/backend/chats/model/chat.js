// server/chats/model/chat.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

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
  messages: [messageSchema],
  timestamp: { type: Date, default: Date.now },
});

chatSchema.index({ userId1: 1, userId2: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
