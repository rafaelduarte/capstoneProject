const Question = require("../model/question.model");
const User = require("../model/user.model");

//Error handling controller
const getErrorMessage = function (err) {
  if (err.errors) {
    for (const errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
};

//Get Questions
const getQuestions = (req, res) => {
  Question.find()
    .populate("owner", "email name")
    .exec((err, questions) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        res.json(questions);
      }
    });
};

//|-}~PENDING~{-|
//Fetch QUESTIONS by a particular USER
const renderUserQuestion = () => {};
const userQuestion = () => {};

//|-}~PENDING~{-|
//Fetch an individual QUESTION with ANSWERS
const renderUserQuestions = () => {};
const userQuestions = () => {};

//Create a Question by particular User
const createQuestion = async (req, res) => {
  const question = new Question();
  question.title = req.body.questionTitle;
  question.text = req.body.questionText;
  question.owner = req.user;

  try {
    const savedQuestion = await question.save().then(
      User.findByIdAndUpdate(
        req.params.id,
        { $push: { questions: question._id } },
        { new: true, useFindAndModify: false }
      ).exec((err, userData) => {
        if (err) {
          res.send(err);
        } else {
          res.json(userData);
        }
      })
    );
    res.send(savedQuestion);
  } catch (err) {
    res.status(400).send(err);
  }
};
//Render the Create Question Page
const renderCreateQuestion = (req, res) => {
  res.send({
    Question: {
      questionTitle: "Enter Question title: ",
      questionText: "Enter Question in Brief: ",
    },
  });
};

//|-}~PENDING~{-|
//Modify a QUESTION
const renderEditQuestion = () => {};
const editQuestion = () => {};

module.exports = {
  getQuestions,
  renderUserQuestion,
  userQuestion,
  renderUserQuestions,
  userQuestions,
  renderCreateQuestion,
  createQuestion,
  renderEditQuestion,
  editQuestion,
};
