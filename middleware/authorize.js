import USER_MODEL from "../models/user.js";
import jwt from "jsonwebtoken";

//middleware

async function verifyToken(req, res, next) {
  const token = req.cookies.token;
  // console.log(req.cookies)
  if (!token) {
    return res.sendStatus(403); // will send forbidden
  }

  if (token == null) return res.sendStatus(401); // No token provided

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await USER_MODEL.findById(decoded.id);

  // console.log(decoded)
  // console.log(user)

  // if jwt payload match in db
  if (user._id == decoded.id) {
    // if uses === not giving true
    // console.log('jwt'+decoded.id)
    // console.log('database'+user._id)
    next();
  }

  await jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    // ERROR
    if (err) {
      //if error login again

      console.log("error is =" + err);
      return res.sendStatus(403);
    }
    // NOT ERROR
  });
}

export default verifyToken;
