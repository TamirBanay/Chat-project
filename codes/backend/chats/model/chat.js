const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const messageSchema = new mongoose.Schema({
  userId: { type: Number, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  userId1: {
    type: Number,
    ref: "User",
    required: true,
  },
  userId2: {
    type: Number,
    ref: "User",
    required: true,
  },
  messages: [messageSchema],
  timestamp: { type: Date, default: Date.now },
});

chatSchema.plugin(AutoIncrement, { inc_field: "chatId" });

module.exports = mongoose.model("Chat", chatSchema);
