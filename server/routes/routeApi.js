const router = require("express").Router();

const ctrlUser = require("../controllers/user");
const authorization = require("../authorization/tokenVerification");
const ctrlQuestion = require("../controllers/question.controller");
const ctrlAnswer = require("../controllers/answer.controller");

//
//
//
//User API

//Register User Route
router.route("/users/register").post(ctrlUser.registerModule);

//Login User Route
router.route("/users/login").post(ctrlUser.loginModule);

//Update User Profile
router
  .route("/:userid/updateUser")
  .put(authorization.verifyToken, ctrlUser.updateUserModule);

//User by email
router.route("/users/findUserByEmail/:emailid").get(ctrlUser.findUserByEmail);
//User by username
router
  .route("/users/findUserByUsername/:username")
  .get(ctrlUser.findUserByUsername);

//
//
//
//QUESTIONS API
//User is asking a QUESTION
//Create QUESTION Route
router
  .route("/:userid/askQuestion")
  .post(authorization.verifyToken, ctrlQuestion.createQuestion);

//Fetch ALL the QUESTIONS
//Get QUESTION Route
router.route("/questions").get(ctrlQuestion.getQuestions);

//Fetch QUESTIONS by a particular USER
router
  .route("/:userid/questions")
  .get(authorization.verifyToken, ctrlQuestion.userQuestions);

//Fetch an individual QUESTION
router.route("/questions/:questionid").get(ctrlQuestion.questionAndAnswer);

//Modify a QUESTION Route
router
  .route("/:questionid/editQuestion")
  .put(authorization.verifyToken, ctrlQuestion.editQuestion);

//Like Quesiton
router
  .route("/:questionId/likeQuestion")
  .put(authorization.verifyToken, ctrlQuestion.likeQuestion);

//DislikeQuestion
router
  .route("/:questionId/unlikeQuestion")
  .put(authorization.verifyToken, ctrlQuestion.unlikeQuestion);

//
//
//
//
//Answer API
//Create ANSWER Route
router
  .route("/questions/:questionid/giveAnswer")
  .post(authorization.verifyToken, ctrlAnswer.createAnswer);

//Fetch all answers
router
  .route("/answers")
  .get(authorization.verifyToken, ctrlAnswer.fetchAnswers);

//Modify answer
router
  .route("/:answerid/editAnswer")
  .put(authorization.verifyToken, ctrlAnswer.editAnswer);

module.exports = router;
