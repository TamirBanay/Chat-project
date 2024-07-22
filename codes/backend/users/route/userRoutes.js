// server/users/route/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  getUserById,
  updateUserStatus,
} = require("../controller/userController");

router.get("/users", getUsers);
router.post("/users", addUser);
router.get("/users/:id", getUserById);
router.put("/users/:id/status", updateUserStatus);

module.exports = router;
