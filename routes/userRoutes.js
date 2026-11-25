import express from "express";

import User from "../models/User.js";
import { signToken } from "../utils/auth.js";
import passport from "../config/passport.js";

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

//==========================================================================
// Route to start the OAuth flow
// 1. When a user visits this URL, they will be redirected to GitHub to log in.
//==========================================================================
router.get(
  '/auth/github',
  // this is using Passport to request from Github the Scope of just the emails
  passport.authenticate('github', { scope: ['user:email'] }) // Request email scope
);


//=================================================================================
// 2.This function executes after Passport has verified a successful authentication, 
// and then proceeds to generate the JWT.
//==============================================================================
router.get(
  '/auth/github/callback',
  // Make sure that we are who we say we are using passport.authenticate
  // as the middleware to do that
  passport.authenticate('github', {
    failureRedirect: '/login', // Where to redirect if user denies
    session: false // We are using tokens, not sessions
  }),
  (req, res) => {
    // console.log(req.user)
    // At this point, `req.user` is the user profile returned from the verify callback.
    // We can now issue our own JWT to the user.
    const token = signToken(req.user);
    // Redirect the user to the frontend with the token, or send it in the response
    // res.redirect(`http://localhost:3000?token=${token}`);

    //  res.json(req.user)
    res.json({
      token,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  }
);

export default router;