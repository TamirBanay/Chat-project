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

const allowedOrigins = [
  "http://localhost:3002",
  "https://tamirbanay.github.io",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
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