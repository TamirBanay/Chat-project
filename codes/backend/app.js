// server/app.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./users/route/userRoutes");
const chatRoutes = require("./chats/route/chatRoutes");
const socketHandler = require("./sockets/socketHandler");

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

// Setup WebSocket
socketHandler(io);

module.exports = server;
