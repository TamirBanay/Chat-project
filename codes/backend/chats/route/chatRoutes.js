// server/chats/route/chatRoutes.js
const express = require("express");
const router = express.Router();
const {
  getChats,
  addChat,
  getChatById,
  getChatByUserId,
} = require("../controller/chatController");

router.get("/", getChats);
router.post("/addChat", addChat);
router.get("/:id", getChatById);
router.post("/addChat", addChat);
router.get("/getChatByUserId/:userId", getChatByUserId);

module.exports = router;
