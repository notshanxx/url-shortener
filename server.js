// import shits
import express from "express";
// import SHORTURL_MODEL from "./models/shortUrl.js";
// import USER_MODEL from "./models/user.js";
import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

//import controllers
import { loginGet, loginPost } from "./controllers/login.controller.js";
import {
  createShortUrl,
  deleteUrl,
  redirectShortUrl,
} from "./controllers/url.controller.js";
import { getHome } from "./controllers/home.controller.js";

// import middleware
import verifyToken from "./middleware/authorize.js";

// import path from 'path'
// import fs from 'fs'
// import { fileURLToPath } from 'url'

// get env
const app = express();
const PORT = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;

//connect ot mongodb
const connectMongoDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully Connected to MongoDB !!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// const __dirname = import.meta.dirname;
// const __filename = import.meta.filename;

//add ejs view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// to use css in ejs put this and add output.css
app.use(express.static("src"));
// allow use of cookies
app.use(cookieParser());

// login hahahahah
// This will create a jwt and save to cookie if entered correct pass and username
app.get("/login", loginGet);
// post username and pass
app.post("/login", loginPost);

// get Home
app.get("/", verifyToken, getHome);
// create
app.post("/shortUrls", createShortUrl);
// redirect
app.get("/:shortUrl", redirectShortUrl);
// delete
app.post("/:id", deleteUrl);

app.listen(PORT, () => {
  connectMongoDB(mongoURI);
  console.log(`Server running in PORT ${PORT}`);
});
