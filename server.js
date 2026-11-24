import 'dotenv/config'
import express from 'express'
import mongoose from "mongoose";

import './config/connection.js'
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 3001;
 
app.use(express.json());

// and connect to our database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.log("Not connected to Database");
    console.error(error);
  });

// Welcome Base route
app.get("/", (req, res) => {
  res.send("Welcome to our Secure-Web-Portal!");
});

 
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));