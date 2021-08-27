require("dotenv").config();

const mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    min: 12,
    max: 255,
  },
  name: {
    type: String,
    required: true,
    min: 6,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  hash: String,
  salt: String,
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

//Password Hashing || Adding some salt and pepper XD
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

//Password Validation
userSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

//Jwt Generation
userSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);

  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.ACCESS_TOKEN_SECRET
  );
};

module.exports = mongoose.model("User", userSchema);
