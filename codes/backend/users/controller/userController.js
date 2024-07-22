// server/users/controller/userController.js
const User = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addUser = async (req, res) => {
  try {
    const { email, username, password, phonNumber, userStatus } = req.body;
    const newUser = new User({
      email,
      username,
      password,
      phonNumber,
      userStatus,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ userid: req.params.id }).populate(
      "chatId"
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findOne({ userid: req.params.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.userStatus = req.body.userStatus;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
