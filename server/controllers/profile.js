var mongoose = require("mongoose");
var User = mongoose.model("User");

const posts = (req, res) => {
  res.send({
    posts: {
      question: "How to login to QandA?",
      answer:
        "First you create a new account, provide all the required information and then you can sign in into our site.",
    },
  });
};

const profile = (req, res) => {
  User.findById(req.user._id).exec((err, user) => {
    res.status(200).json("Found");
  });
};

module.exports = { posts, profile };
