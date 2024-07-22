// server/app.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./users/route/userRoutes");
const chatRoutes = require("./chats/route/chatRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", chatRoutes);

// WebSocket setup
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendChat", (data) => {
    // Here you will handle the chat message and save it to the database
    console.log("Received chat:", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = server;
