// server/chats/route/chatRoutes.js
const express = require("express");
const router = express.Router();
const {
  getChats,
  addChat,
  getChatById,
  getChatByUserId,
  addChatByPhoneNumber,
  getChatByUserIdLastChat
} = require("../controller/chatController");

router.get("/", getChats);
router.post("/addChat", addChat);
router.get("/:id", getChatById);
router.post("/addChat", addChat);
router.get("/getChatByUserId/:userId", getChatByUserId);
router.get("/getChatByUserIdLastChat/:userId", getChatByUserIdLastChat);

router.post("/addChatByPhoneNumber", addChatByPhoneNumber);

module.exports = router;
