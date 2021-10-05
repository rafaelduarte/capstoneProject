var mongoose = require("mongoose");
var User = mongoose.model("User");

const profile = (req, res) => {
  const userId = req.params.userid;
  User.findById(userId).exec((err, user) => {
    if (err) return res.status(400).send({ message: getErrorMessage(err) });
    else res.json(user);
  });
};

module.exports = { profile };
