const User = require("../model/user.model");
const {
  registerValidation,
  loginValidation,
} = require("../validation/joiValidation");

//Create User Module
const registerModule = async (req, res) => {
  //Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(422).json(error.details[0].message);

  //Check if email(user) already exists in Database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(422).send("Email already exists");

  //Check if username(user) already exists in Database
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(422).send("Username already Exists");

  //Create a new user
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  // New Fields
  user.username = req.body.username;
  user.bio = req.body.bio;
  user.date_of_birth = req.body.birthday;
  user.profile_pic = req.body.profile_pic;
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

//Login User Module
const loginModule = async (req, res) => {
  //Validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(422).send(error.details[0].message);

  //Check if email(user) exists in Database
  await User.findOne({ email: req.body.email }, function (err, user) {
    //Are there any server/database error
    if (err) return res.send(err);
    //Is Email corect?
    if (!user) return res.status(422).send("Email or password is incorrect");
    //Is password correct?
    if (!user.validPassword(req.body.password))
      return res.status(422).send("Email or password is incorrect");

    //Assigning JWT token
    var token = user.generateJwt();
    //res.header("auth-token", token).send(token);
    res.json({ user, token });
    //res.cookie("token", token, { httpOnly: true }).send(token);
  });
};

//FindUserByEmail

const findUserByEmail = (req, res) => {
  User.find({ email: req.params.emailid }).exec((err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    }
    if (user.length === 0) {
      res.status(400).json({ success: false, message: "user not found" });
    } else if (user) {
      res.json(user[0].email);
    }
  });
};

const findUserByUsername = (req, res) => {
  User.find({ username: req.params.username }).exec((err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    }
    if (user.length === 0) {
      res.status(400).json({ success: false, message: "user not found" });
    } else if (user) {
      res.json(user[0].username);
    }
  });
};

const updateUserModule = async (req, res) => {
  await User.findOne({ _id: req.params.userid }, (err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      if (!user) {
        res.json({ sucess: false, message: "User not found" });
      } else {
        if (user._id != req.user._id) {
          res.json({ sucess: false, message: "Not the same user" });
        } else {
          user.name = req.body.name;
          user.email = req.body.email;
          // New Fields
          user.username = req.body.username;
          user.bio = req.body.bio;
          user.date_of_birth = req.body.dob;
          user.profile_pic = req.body.profile_pic;
          user.save({ validateBeforeSave: false }, (err) => {
            if (err) {
              res.json({
                sucess: false,
                message: "Something went wrong..!!",
                error: err,
              });
            } else {
              res.json({ success: true, message: "User updated", User: user });
            }
          });
        }
      }
    }
  });
};

module.exports = {
  registerModule,
  loginModule,
  updateUserModule,
  findUserByEmail,
  findUserByUsername,
};
