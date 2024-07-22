// server/sockets/socketHandler.js
const Chat = require("../chats/model/chat");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`Client joined chat ${chatId}`);
    });

    socket.on("sendMessage", async (data) => {
      const { chatId, message, userId } = data;

      console.log(
        `Received message: ${message} from user: ${userId} in chat: ${chatId}`
      );

      try {
        console.log("Finding chat:", chatId);
        const chat = await Chat.findOne({ chatId: Number(chatId) });
        console.log("Chat found:", chat);

        if (!chat) {
          console.log("Chat not found");
          socket.emit("error", "Chat not found");
          return;
        }

        const newMessage = { userId, message, timestamp: new Date() };
        chat.messages.push(newMessage);
        await chat.save();

        io.to(chatId).emit("receiveMessage", newMessage);
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
