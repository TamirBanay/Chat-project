// server/sockets/socketHandler.js
const Chat = require("../chats/model/chat");
const User = require("../users/models/user");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinChat", async (chatId) => {
      socket.join(chatId);
      console.log(`Client joined chat ${chatId}`);

      try {
        const chat = await Chat.findOne({ chatId: Number(chatId) });

        if (chat) {
          // מצא את שמות המשתמשים עבור userId1 ו- userId2
          const user1 = await User.findOne({ userid: chat.userId1 });
          const user2 = await User.findOne({ userid: chat.userId2 });

          const chatData = {
            user1: user1 ? user1.username : "Unknown",
            user2: user2 ? user2.username : "Unknown",
            messages: await Promise.all(
              chat.messages.map(async (msg) => {
                const user = await User.findOne({ userid: msg.userId });
                return {
                  ...msg.toObject(),
                  username: user ? user.username : "Unknown",
                };
              })
            ),
          };

          socket.emit("chatHistory", chatData);
        } else {
          console.log("Chat not found for chatId:", chatId);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { chatId, message, userId } = data;

      console.log(
        `Received message: ${message} from user: ${userId} in chat: ${chatId}`
      );

      try {
        const chat = await Chat.findOne({ chatId: Number(chatId) });
        if (!chat) {
          console.log("Chat not found");
          socket.emit("error", "Chat not found");
          return;
        }

        const newMessage = { userId, message, timestamp: new Date() };
        chat.messages.push(newMessage);
        await chat.save();

        const user = await User.findOne({ userid: userId });
        const messageWithUsername = {
          ...newMessage,
          username: user ? user.username : "Unknown",
        };

        io.to(chatId).emit("receiveMessage", messageWithUsername);

        console.log(`Message sent: ${message}`);
      } catch (err) {
        console.error("Error handling message:", err);
        socket.emit("error", "Server error");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = socketHandler;
