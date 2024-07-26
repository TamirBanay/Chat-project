const User = require("../models/user");
const path = require("path");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const maleImages = [
  "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
  "https://cdn-icons-png.flaticon.com/128/16683/16683419.png",
  "https://cdn-icons-png.flaticon.com/128/4139/4139981.png",
  "https://cdn-icons-png.flaticon.com/128/3001/3001764.png",
];

const femaleImages = [
  "https://cdn-icons-png.flaticon.com/128/4140/4140047.png",
  "https://cdn-icons-png.flaticon.com/128/16683/16683451.png",
  "https://cdn-icons-png.flaticon.com/128/2922/2922561.png",
  "https://cdn-icons-png.flaticon.com/128/4140/4140051.png",
  "https://cdn-icons-png.flaticon.com/128/11107/11107521.png",
];

const otherImages = [
  "https://cdn-icons-png.flaticon.com/128/4202/4202831.png",
  "https://cdn-icons-png.flaticon.com/128/17051/17051684.png",
  "https://cdn-icons-png.flaticon.com/128/4202/4202848.png",
  "https://cdn-icons-png.flaticon.com/128/2922/2922510.png",
];

function getRandomImage(images) {
  return images[Math.floor(Math.random() * images.length)];
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.addUser = async (req, res) => {
  const { email, username, password, phonNumber, gender } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // קביעת תמונת הפרופיל בהתאם ל-gender
    let profileImage;
    switch (gender) {
      case "male":
        profileImage = getRandomImage(maleImages);
        break;
      case "female":
        profileImage = getRandomImage(femaleImages);
        break;
      default:
        profileImage = getRandomImage(otherImages);
    }

    user = new User({
      email,
      username,
      password,
      phonNumber,
      gender,
      profileImage,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateUserStatus = async (req, res) => {
  const { userStatus } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.userStatus = userStatus;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Attempting to find user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("User found:", user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.userid,
      },
    };

    console.log("Signing token with secret:", secret);
    jwt.sign(payload, secret, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error("Error signing token:", err);
        throw err;
      }
      console.log("Token generated:", token);
      res.json({
        token,
        user: {
          id: user.userid,
          email: user.email,
          username: user.username,
          phonNumber: user.phonNumber,
          userStatus: user.userStatus,
          gender: user.gender,
          profileImage: user.profileImage,
        },
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports.authMiddleware = authMiddleware;
