require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./users/route/userRoutes");
const chatRoutes = require("./chats/route/chatRoutes");
const socketHandler = require("./sockets/socketHandler");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// Setup WebSocket
socketHandler(io);

module.exports = server;
