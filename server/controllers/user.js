const User = require("../model/user.model");
const {
  registerValidation,
  loginValidation,
} = require("../validation/joiValidation");

//Create User Module
const registerModule = async (req, res) => {
  //Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(401).json(error.details[0].message);

  //Check if email(user) already exists in Database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Check if username(user) already exists in Database
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send("Username already Exists");

  //Create a new user
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.username = req.body.username;
  user.bio = req.body.bio;
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};
//Render Create User Module
const renderRegisterModule = () => {};

//Login User Module
const loginModule = async (req, res) => {
  //Validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if email(user) exists in Database
  await User.findOne({ email: req.body.email }, function (err, user) {
    //Are ther eany server/database error
    if (err) return res.send(err);
    //Is Email corect?
    if (!user) return res.status(401).send("Email or password is incorrect");
    //Is password correct?
    if (!user.validPassword(req.body.password))
      return res.status(400).send("Password incorrect");

    //Assigning JWT token
    var token = user.generateJwt();
    //res.header("auth-token", token).send(token);
    res.json({ user, token });
    //res.cookie("token", token, { httpOnly: true }).send(token);
  });
};
//Render Login Module
const renderLoginModule = () => {};

module.exports = {
  registerModule,
  renderRegisterModule,
  loginModule,
  renderLoginModule,
};
