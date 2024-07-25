// server/chats/route/chatRoutes.js
const express = require("express");
const router = express.Router();
const {
  getChats,
  addChat,
  getChatById,
  getChatByUserId,
  addChatByPhoneNumber,
} = require("../controller/chatController");

router.get("/", getChats);
router.post("/addChat", addChat);
router.get("/:id", getChatById);
router.post("/addChat", addChat);
router.get("/getChatByUserId/:userId", getChatByUserId);
router.post("/addChatByPhoneNumber", addChatByPhoneNumber);

module.exports = router;
