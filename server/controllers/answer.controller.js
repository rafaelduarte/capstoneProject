const Answer = require("../model/answer.model");
const Question = require("../model/question.model");

//Create ANSWER Route
const createAnswer = async (req, res) => {
  const answer = new Answer();
  answer.text = req.body.text;
  answer.author = req.user;

  try {
    await answer.save().then(
      Question.findByIdAndUpdate(
        req.params.questionid,
        { $push: { answers: answer._id } },
        { new: true, useFindAndModify: false }
      ).exec((err, questionData) => {
        if (err) {
          console.log(err);
        } else {
          res.send(questionData);
        }
      })
    );
  } catch (err) {
    res.status(400).send(err);
  }
};

//FETCH Answers
const fetchAnswers = async (req, res) => {
  Answer.find()
    .populate("author", "_id")
    .exec((err, answers) => {
      if (err) {
        return res.status(400).send({ message: getErrorMessage(err) });
      } else {
        res.json(answers);
      }
    });
};
module.exports = { createAnswer, fetchAnswers };
