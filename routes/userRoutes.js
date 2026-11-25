import express from "express";

import User from "../models/User.js";
import { signToken } from "../utils/auth.js";

const router = express.Router();

// POST /api/users/register - Create a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists.",
      });
    }

    // create a new user and hash the password
    const user = await User.create({
      username,
      email,
      password,
    });

    // generate a JWT
    const token = signToken(user);

    // Return the token and user information
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: "Error registering user.",
    });
  }
});

// POST /api/users/login - Authenticate a user and return a token
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !user.password) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error logging in.",
    });
  }
});

export default router;