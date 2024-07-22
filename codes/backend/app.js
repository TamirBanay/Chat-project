// server/app.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./users/route/userRoutes");
const chatRoutes = require("./chats/route/chatRoutes");
const { addChat } = require("./chats/controller/chatController");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// WebSocket setup
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendChat", async (data) => {
    try {
      const { userId1, userId2 } = data;
      const newChat = { userId1, userId2 };

      // Add chat to the database
      const ChatController = require("./chats/controller/chatController");
      await ChatController.addChat(
        { body: newChat },
        {
          status: (statusCode) => ({
            json: (json) => socket.emit("chat", json),
          }),
          send: (message) => console.log(message),
        }
      );
    } catch (err) {
      console.error("Error saving chat:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = server;
