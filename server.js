import express from "express";
import SHORTURL_MODEL from "./models/shortUrl.js";
import mongoose from "mongoose";
// import path from 'path'
// import fs from 'fs'
// import { fileURLToPath } from 'url'

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

app.get("/", async (req, res) => {
  const urlLists = await SHORTURL_MODEL.find();
  res.render("index", { shortUrls: urlLists });
});
// create
app.post("/shortUrls", async (req, res) => {
  await SHORTURL_MODEL.create({
    full: req.body.fullUrl,
  });

  res.redirect("/");
});
// redirect
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await SHORTURL_MODEL.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) {
    return res.sendStatus(404);
  }
  shortUrl.clicks++;
  shortUrl.save();

  await res.redirect(shortUrl.full);
});

// delete
app.post("/:id", async (req, res) => {
  const id = req.params.id;
  const deleteAction = await SHORTURL_MODEL.findOneAndDelete({ _id: id });
  if (deleteAction == null) return res.sendStatus(404);

  res.redirect("/");
});

app.listen(PORT, () => {
  connectMongoDB(mongoURI);
  console.log(`Server running in PORT ${PORT}`);
});
