const User = require("../model/user.model");
const {
  registerValidation,
  loginValidation,
} = require("../validation/joiValidation");

//REGISTER MODULE
const registerModule = async (req, res) => {
  //Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if email(user) already exists in Database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Create a new user
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};
//LOGIN MODULE
const loginModule = async (req, res) => {
  //Validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if email(user) exists in Database
  await User.findOne({ email: req.body.email }, function (err, user) {
    //Are ther eany server/database error
    if (err) return res.send(err);
    //Is Email corect?
    if (!user) return res.status(400).send("Email or password is incorrect");
    //Is password correct?
    if (!user.validPassword(req.body.password))
      return res.status(400).send("Password incorrect");

    //Assigning JWT token
    var token = user.generateJwt();
    res.header("auth-token", token).send(token);
  });
};

module.exports = { registerModule, loginModule };