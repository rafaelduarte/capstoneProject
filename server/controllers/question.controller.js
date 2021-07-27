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
//Fetch an individual QUESTION with ANSWERS
const renderQuestionAndAnswer = (req, res) => {};
const questionAndAnswer = (req, res) => {};

//|-}~PENDING~{-|
//Fetch QUESTIONS by a particular USER
const renderUserQuestions = (req, res) => {
  res.send({
    User: {
      Question: {
        questionTitle: "Question title: ",
        questionText: "Question in Brief: ",
      },
    },
  });
};
const userQuestions = (req, res) => {
  const userID = req.params.userID;
  Question.find({ owner: userID })
    .populate("owner", "name")
    .exec((err, questions) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        res.status(200).json(questions);
      }
    });
};

//Create a Question by particular User
const createQuestion = async (req, res) => {
  const question = new Question();
  question.title = req.body.questionTitle;
  question.text = req.body.questionText;
  question.owner = req.user;

  try {
    await question.save().then(
      User.findByIdAndUpdate(
        req.params.userID,
        { $push: { questions: question._id } },
        { new: true, useFindAndModify: false }
      ).exec((err, userData) => {
        if (err) {
          console.error(err);
        } else {
          res.send(userData);
        }
      })
    );
  } catch (err) {
    console.error(err);
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
  renderQuestionAndAnswer,
  questionAndAnswer,
  getQuestions,
  renderUserQuestions,
  userQuestions,
  renderCreateQuestion,
  createQuestion,
  renderEditQuestion,
  editQuestion,
};
