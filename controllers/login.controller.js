import USER_MODEL from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from 'path'

const __dirname = import.meta.dirname;
// const __filename = import.meta.filename;
// console.log(__filename)
// console.log(__dirname)
export const loginGet = async (req, res) => {

    // check if theres already a token
    const token = req.cookies.token;
    console.log(token)
    if (token) {
      if(jwt.verify(token, process.env.JWT_SECRET)){
        return res.redirect('/')
      }
    }
    // else login page

    // added .. to go back one folder level or go to root
    res.sendFile(path.join(__dirname, "../login.html"));
  }


// POST /login

export const loginPost = async (req, res) => {
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
  
      return res.redirect('/')
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
  }

