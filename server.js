import express, { json } from "express";
import SHORTURL_MODEL from "./models/shortUrl.js";
import USER_MODEL from "./models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
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
app.use(express.json())
app.use(cookieParser())

// login hahahahah



//middleware

async function verifyToken (req, res, next){
  const token = req.cookies.token;
  // console.log(req.cookies)
  if (!token) {
    return res.sendStatus(403);// will send forbidden
  }

  if (token == null) return res.sendStatus(401); // No token provided

  const decoded = jwt.verify(token,process.env.JWT_SECRET)

  const user = await USER_MODEL.findById(decoded.id)

  // console.log(decoded)
  // console.log(user)

  // if jwt payload match in db
    if(user._id == decoded.id){
      // if uses === not giving true
      // console.log('jwt'+decoded.id)
      // console.log('database'+user._id)
      next()
    }
    

  
  

  await jwt.verify(token,process.env.JWT_SECRET, (err, data) =>{
    // ERROR
    if (err) {
      //if error login again

      console.log('error is =' +err)
       return res.sendStatus(403)
      
    }
    // NOT ERROR

  })
  
   
}




// This will create a jwt and save to cookie if entered correct pass and username
app.get("/login", async (req, res) => {

  // check if theres already a token
  const token = req.cookies.token;
  console.log(token)
  if (token) {
    if(jwt.verify(token, process.env.JWT_SECRET)){
      return res.redirect('/')
    }
  }


  // else login page

  res.sendFile(__dirname + "/login.html");
});


// post username and pass

app.post("/login", async (req, res) => {
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

       // create jwt token
      const token = jwt.sign({username: user.name, id: user._id}, process.env.JWT_SECRET, {expiresIn: "15m"})

      
      // console.log("id: " + user._id)
      // console.log(token)
      // console.log(jwt.verify(token,process.env.JWT_SECRET))


      // Our `token` cookie will be parsed into `req.cookies.token`
    console.log( "🍪", req.cookies );
    
    // Configure the `token` HTTPOnly cookie
    let options = {
        maxAge: 1000 * 60 * 15, // expire after 15 minutes
        httpOnly: true, // Cookie will not be exposed to client side code
        sameSite: "none", // If client and server origins are different
        secure: true // use with HTTPS only
    }

    
    res.cookie( "token", token, options );
    // console.log( "🍪", req.cookies );

    return res.sendStatus(200)
    //send status 200 ok

    }
    console.log("wrong pass");
    res.sendStatus(401)
    //send 401 unauthorize
  } catch (error) {
    console.log(error);
    res.sendStatus(500)
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

app.get("/", verifyToken, async (req, res) => {
  
  
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
