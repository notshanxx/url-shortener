import express from "express";
import SHORTURL_MODEL from "./models/shortUrl.js";
import USER_MODEL from "./models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
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

const __dirname = import.meta.dirname;
// const __filename = import.meta.filename;

//add ejs view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// to use css in ejs put this and add output.css
app.use(express.static("src"));

// login hahahahah

let allow = false;

app.get("/login", async (req, res) => {
  if (allow) {
    return res.redirect("/");
  }

  res.sendFile(__dirname + "/login.html");
});

app.post("/login", async (req, res) => {
  // check if allowed
  if (allow) {
    return res.redirect("/");
  }

  // COMPARINGS
  const user = await USER_MODEL.findOne({ name: req.body.username });

  // check if no found user
  if (user === null) {
    console.log('cant find user')
    return res.status(400).redirect('/login')
  }

  // check password
  // NOTE!! user already encrypted in db
  try {
    if( await bcrypt.compare(req.body.password, user.password)){
      console.log("yayaay");
      allow = true;
      return res.redirect("/");
    }
    console.log("wrong pass");
    
  } catch (error) {
    console.log(error);
    res.status(500).send()
  }


  // if (user.name === req.body.username) {
  //   console.log("THEREs user with that name");
  //   console.log(userList.password)
  //   if (user.password === req.body.password) {
  //     console.log("yayaay");
  //     allow = true;
  //     return res.redirect("/");
  //   }
  //   console.log("wrong");
  // } else {
  //   console.log("not success");
  // }
  // console.log(user);
  // console.log(req.body.password);
  // console.log(userList.password);

  // res.redirect("/login");
});

// end of login

app.get("/", async (req, res) => {
  // check if true
  if (!allow) {
    return res.redirect("/login");
  }
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
