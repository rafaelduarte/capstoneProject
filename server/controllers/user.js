const mongoose = require('mongoose');
const User = mongoose.model('User');

const getUsers = function (_, res) {
  User.find()
    .exec(function (err, userData) {
      if (err) {
        res.status(404).json(err);
        return;
      }
      res.status(200).json(userData);
    });
};

const getSingleUser = function (req, res) {
  User.findById(req.params.userId)
    .exec((err, userData) => {
      if (!userData) {
        return res.status(404).json({
          'message' : 'User not found.'
        });
      } else if (err) {
        return res.status(404).json(err);
      }
      res.status(200).json(userData);
    });
};

const createUser = function (req, res) {
  User.create({
    name       : req.body.name,
    email      : req.body.email,
    username   : req.body.username,
    dob        : req.body.dob,
    questions  : req.body.questions,
    answers    : req.body.answers,
    comments   : req.body.comments,
    joinDate   : req.body.joinDate,
    lastUpdate : req.body.lastUpdate,
  }, (err, userData) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(201).json(userData);
    }
  });
};

const updateUser = function (req, res) {
  if (!req.params.userId) {
    res.status(404).json({
      'message' : 'userId is required to update.'
    });
    return;
  }
  User.findById(req.params.userId)
    .exec((err, userData) => {
      if (!userData) {
        res.status(404).json({
          'message' : 'User not found.'
        });
        return;
      } else if (err) {
        res.status(400).json(err);
        return;
      }
      userData.name       = req.body.name;
      userData.email      = req.body.email;
      userData.username   = req.body.username;
      userData.dob        = req.body.dob;
      userData.questions  = req.body.questions;
      userData.answers    = req.body.answers;
      userData.comments   = req.body.comments;
      userData.joinDate   = req.body.joinDate;
      userData.lastUpdate = req.body.lastUpdate;
      userData.save((err, userData) => {
        if (err) {
          res.status(404).json(err);
          return;
        } else {
          res.status(200).json(userData);
        }
      });
    });
};

const deleteUser = function (req, res) {
  const userId = req.params.userId;
  if (userId) {
    User.findByIdAndDelete(userId)
      .exec((err, _) => {
        if (err) {
          res.status(404).json(err);
          return;
        }
        res.status(204).json(null);
      });
  } else {
    res.status(404).json({
      'message' : 'User not found.'
    });
  }
};

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
