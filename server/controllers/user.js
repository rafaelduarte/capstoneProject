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
  user.date_of_birth = req.body.dob;
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
    //Are ther eany server/database error
    if (err) return res.send(err);
    //Is Email corect?
    if (!user) return res.status(422).send("Email or password is incorrect");
    //Is password correct?
    if (!user.validPassword(req.body.password))
      return res.status(422).send("Password incorrect");

    //Assigning JWT token
    var token = user.generateJwt();
    //res.header("auth-token", token).send(token);
    res.json({ user, token });
    //res.cookie("token", token, { httpOnly: true }).send(token);
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
};
