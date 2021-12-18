const { string } = require("joi");
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

//Fetch an individual QUESTION with ANSWERS
const questionAndAnswer = (req, res) => {
  const questionid = req.params.questionid;
  Question.findOne({ _id: questionid })
    .populate("owner", "email name")
    .populate({
      path: "answers",
      populate: { path: "author", select: "name" },
    })
    .exec((err, question) => {
      if (err) {
        return res.status(400).send({ message: getErrorMessage(err) });
      } else {
        res.json(question);
      }
    });
};

//Fetch QUESTIONS by a particular USER
const userQuestions = (req, res) => {
  const userid = req.params.userid;

  Question.find({ owner: userid }).exec((err, questions) => {
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
  question.title = req.body.title;
  question.text = req.body.text;
  question.owner = req.user;

  try {
    await question.save().then(
      User.findByIdAndUpdate(
        req.params.userid,
        { $push: { questions: question._id } },
        { new: true, useFindAndModify: false }
      ).exec((err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.send(data);
        }
      })
    );
  } catch (err) {
    console.error(err);
  }
};

//Modify a QUESTION
const editQuestion = async (req, res) => {
  const questionid = req.params.questionid;
  const question = new Question();
  question.title = req.body.title;
  question.text = req.body.text;

  try {
    await Question
      .findByIdAndUpdate(questionid, { title: question.title, text: question.text }, { new: true })
      .exec((err, data) => {
        if (err) {
          console.error(err);
        } else {
          res.send(data);
        }
      });
  } catch (err) {
    console.error(err);
  }
};

const likeQuestion = async (req, res) => {
  try {
    await Question.findOne({ _id: req.params.questionId }).exec(
      (err, question) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (!question) {
            res.json({ success: false, message: "No question found." });
          } else {
            if (question.owner == req.user._id) {
              res.json({
                success: false,
                message: "Question owner cannot like their own questions.",
              });
            } else {
              if (question.likedBy.includes(req.user._id)) {
                res.json({
                  success: false,
                  message: "You already liked this Question.",
                });
              } else {
                question.likes++;
                question.likedBy.push(req.user._id);
                question.save((err) => {
                  if (err) {
                    res.json({
                      sucess: false,
                      message: "Something went wrong",
                      err: err,
                    });
                  } else {
                    res.json({ sucess: true, message: "Question Liked..!!" });
                  }
                });
              }
            }
          }
        }
      }
    );
  } catch (err) {
    res.json({ message: err });
  }
};

const unlikeQuestion = async (req, res) => {
  try {
    await Question.findOne({ _id: req.params.questionId }).exec(
      (err, question) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (!question) {
            res.json({ success: false, message: "No question found." });
          } else {
            if (question.owner == req.user._id) {
              res.json({
                success: false,
                message: "Question owner cannot dislike their own questions.",
              });
            } else {
              if (question.likedBy.includes(req.user._id)) {
                const arrayIndex = question.likedBy.indexOf(req.user._id);
                question.likedBy.splice(arrayIndex, 1);
                question.likes--;
                question.save((err) => {
                  if (err) {
                    res.json({
                      success: true,
                      message: "Something went wrong..!!",
                      error: err,
                    });
                  } else {
                    res.json({ success: true, message: "Question unliked." });
                  }
                });
              } else {
                question.likes--;
                question.save((err) => {
                  if (err) {
                    res.json({
                      sucess: false,
                      message: "Something went wrong",
                    });
                  } else {
                    res.json({
                      sucess: true,
                      message: "Question unliked..!!",
                    });
                  }
                });
              }
            }
          }
        }
      }
    );
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  questionAndAnswer,
  getQuestions,
  userQuestions,
  createQuestion,
  editQuestion,
  likeQuestion,
  unlikeQuestion,
};
