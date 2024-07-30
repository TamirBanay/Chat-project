// server/chats/controller/chatController.js
const Chat = require("../model/chat");
const User = require("../../users/models/user");

// exports.getChatByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const chats = await Chat.find({
//       $or: [{ userId1: userId }, { userId2: userId }],
//     })
//       .populate("userId1", "username email profileImage")
//       .populate("userId2", "username email profileImage");

//     // מצא את פרטי המשתמש של userId2
//     for (const chat of chats) {
//       await chat.populate("userId2").execPopulate();
//     }

//     res.json(chats);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

exports.getChatByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdNumber = Number(userId); // Ensure userId is a number

    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [{ userId1: userIdNumber }, { userId2: userIdNumber }],
        },
      },
      {
        $project: {
          userId1: 1,
          userId2: 1,
          messages: { $slice: ["$messages", -1] }, // Get the last message only
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId1",
          foreignField: "userid",
          as: "userId1Details",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId2",
          foreignField: "userid",
          as: "userId2Details",
        },
      },
      {
        $unwind: {
          path: "$userId1Details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$userId2Details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId1: 1,
          userId2: 1,
          messages: 1,
          "userId1Details.username": 1,
          "userId1Details.email": 1,
          "userId1Details.profileImage": 1,
          "userId2Details.username": 1,
          "userId2Details.email": 1,
          "userId2Details.profileImage": 1,
        },
      },
      { $limit: 100 }, // Optional limit for pagination
    ]).exec();

    res.json(chats);
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

    // בדיקה אם המשתמשים קיימים
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

    const user1 = await User.findOne({ phonNumber: userIdPhoneNumber1 });
    const user2 = await User.findOne({ phonNumber: userIdPhoneNumber2 });

    if (!user1 || !user2) {
      return res.status(400).json({ msg: "One or both users not found" });
    }

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
