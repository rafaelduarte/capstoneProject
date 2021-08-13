const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

//Middleware for token verification.
function authorization(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");
  //console.log(token);

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //const user = User.find((user) => (user._id = verified._id));
    const user = User.find((_id = verified._id));

    if (!user) {
      // console.log("User :" + user);
      // console.log("User _id:" + user._id);
      // console.log("User name:" + user.name);
      // console.log("Token _id:" + verified._id);
      console.log("Not Found");
    } else {
      console.log("Found");
    }
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token" + err);
  }
}

module.exports = { authorization };
