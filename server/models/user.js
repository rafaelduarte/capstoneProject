const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name       : { type: String, required: true },
  email      : { type: String, required: true },
  username   : { type: String, required: true },
  dob        : { type: Date, max: Date.now },
  questions  : { type: Number, default: 0 },
  answers    : { type: Number, default: 0 },
  comments   : { type: Number, default: 0 },
  joinDate   : { type: Date, default: Date.now },
  lastUpdate : { type: Date, default: Date.now },
});

const userModel = mongoose.model('User', userSchema);

module.exports = { userModel };
