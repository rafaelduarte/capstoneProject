const mongoose = require('mongoose');
const Question = mongoose.model('Question');

const getQuestions = function (_, res) {
  Question.find()
    .exec(function (err, questionData) {
      if (err) {
        res.status(404).json(err);
        return;
      }
      res.status(200).json(questionData);
    });
};

const getSingleQuestion = function (req, res) {
  Question.findById(req.params.questionId)
    .exec((err, questionData) => {
      if (!questionData) {
        return res.status(404).json({
          'message' : 'Question not found.'
        });
      } else if (err) {
        return res.status(404).json(err);
      }
      res.status(200).json(questionData);
    });
};

const createQuestion = function (req, res) {
  Question.create({
    title      : req.body.title,
    text       : req.body.text,
    userId     : req.body.userId,
    date       : req.body.date,
    lastUpdate : req.body.date,
    status     : req.body.status,
  }, (err, questionData) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(201).json(questionData);
    }
  });
};

const updateQuestion = function (req, res) {
  if (!req.params.questionId) {
    res.status(404).json({
      'message' : 'questionId is required to update.'
    });
    return;
  }
  Question.findById(req.params.questionId)
    .exec((err, questionData) => {
      if (!questionData) {
        res.status(404).json({
          'message' : 'Question not found.'
        });
        return;
      } else if (err) {
        res.status(400).json(err);
        return;
      }
      questionData.title      = req.body.title;
      questionData.text       = req.body.text;
      questionData.userId     = req.body.userId;
      questionData.date       = req.body.date;
      questionData.lastUpdate = req.body.date;
      questionData.status     = req.body.status;
      questionData.save((err, questionData) => {
        if (err) {
          res.status(404).json(err);
          return;
        } else {
          res.status(200).json(questionData);
        }
      });
    });
};

const deleteQuestion = function (req, res) {
  const questionId = req.params.questionId;
  if (questionId) {
    Question.findByIdAndDelete(questionId)
      .exec((err, _) => {
        if (err) {
          res.status(404).json(err);
          return;
        }
        res.status(204).json(null);
      });
  } else {
    res.status(404).json({
      'message' : 'Question not found.'
    });
  }
};

module.exports = {
  getQuestions,
  getSingleQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
