// server/chats/controller/chatController.js
const Chat = require("../model/chat");
const User = require("../../users/models/user");

exports.getChatByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    })
      .populate("userId1", "username email")
      .populate("userId2", "username email");

    // מצא את פרטי המשתמש של userId2
    for (const chat of chats) {
      await chat.populate("userId2").execPopulate();
    }

    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.getChatByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    });

    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        const user1 = await User.findOne({ userid: chat.userId1 }).select(
          "username email gender"
        );
        const user2 = await User.findOne({ userid: chat.userId2 }).select(
          "username email gender"
        );
        return {
          ...chat.toObject(),
          userId1Details: user1,
          userId2Details: user2,
        };
      })
    );

    res.json(populatedChats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

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
      return res.status(400).json({ msg: "One or both users not found" });
    }

    const newChat = new Chat({
      userId1: userId1,
      userId2: userId2,
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.addChatByPhoneNumber = async (req, res) => {
  try {
    const { userIdPhoneNumber1, userIdPhoneNumber2 } = req.body;

    // בדיקה אם המשתמשים קיימים
    const user1 = await User.findOne({ phonNumber: userIdPhoneNumber1 });
    const user2 = await User.findOne({ phonNumber: userIdPhoneNumber2 });

    if (!user1 || !user2) {
      return res.status(400).json({ msg: "One or both users not found" });
    }

    // בדיקה אם קיים צ'אט בין המשתמשים
    const existingChat = await Chat.findOne({
      $or: [
        { userId1: user1.userid, userId2: user2.userid },
        { userId1: user2.userid, userId2: user1.userid },
      ],
    });

    if (existingChat) {
      return res
        .status(400)
        .json({ msg: "Chat between these users already exists" });
    }

    const newChat = new Chat({
      userId1: user1.userid,
      userId2: user2.userid,
      chatId: new Date().getTime(),
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
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
