// server/chats/route/chatRoutes.js
const express = require("express");
const router = express.Router();
const {
  getChats,
  addChat,
  getChatById,
} = require("../controller/chatController");

router.get("/", getChats);
router.post("/", addChat);
router.get("/:id", getChatById);

module.exports = router;
