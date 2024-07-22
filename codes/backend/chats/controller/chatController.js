// server/chats/controller/chatController.js
const Chat = require("../model/chat");
const User = require("../../users/models/user");

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate("userId1 userId2");
    res.json(chats);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addChat = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    const user1 = await User.findOne({ userid: userId1 });
    const user2 = await User.findOne({ userid: userId2 });

    if (!user1 || !user2) {
      return res.status(404).json({ msg: "One or both users not found" });
    }

    const existingChat = await Chat.findOne({
      $or: [
        { userId1: user1._id, userId2: user2._id },
        { userId1: user2._id, userId2: user1._id },
      ],
    });
    if (existingChat) {
      return res
        .status(400)
        .json({ msg: "Chat between these users already exists" });
    }

    const newChat = new Chat({ userId1: user1._id, userId2: user2._id });
    await newChat.save();

    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate("userId1 userId2");
    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }
    res.json(chat);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
