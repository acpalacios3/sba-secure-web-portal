import 'dotenv/config'
import express from 'express'
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import bookmarkRoutes from "./routes/bookRoutes.js";
import passport from 'passport';
import "./config/passport.js";

import './config/connection.js'


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(passport.initialize());

app.use("/api/users", userRoutes);
app.use("/api/bookmark", bookmarkRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to our Secure-Web-Portal!");
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));