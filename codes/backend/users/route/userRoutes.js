// server/users/route/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  getUserById,
  updateUserStatus,
} = require("../controller/userController");

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:id", getUserById);
router.put("/:id/status", updateUserStatus);

module.exports = router;
