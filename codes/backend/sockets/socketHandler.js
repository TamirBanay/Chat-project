// server/sockets/socketHandler.js
const Chat = require("../chats/model/chat");
const mongoose = require("mongoose");
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinChat", async (chatId) => {
      socket.join(chatId);
      console.log(`Client joined chat ${chatId}`);

      // Fetch chat history and send to the client
      try {
        const chat = await Chat.findOne({ chatId: Number(chatId) }).populate({
          path: "chatId",
          select: "username",
        });

        if (chat) {
          socket.emit("chatHistory", chat.messages);
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

        // Emit the new message with user information
        const populatedMessage = await chat
          .populate("messages.userId", "username")
          .execPopulate();
        io.to(chatId).emit(
          "receiveMessage",
          populatedMessage.messages.slice(-1)[0]
        );

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
