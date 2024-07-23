const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  getUserById,
  updateUserStatus,
  loginUser,
  getUser,
} = require("../controller/userController");
const { authMiddleware } = require("../controller/userController");

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:id", getUserById);
router.put("/:id/status", updateUserStatus);
router.post("/login", loginUser);
router.get("/auth", authMiddleware, getUser);

module.exports = router;
