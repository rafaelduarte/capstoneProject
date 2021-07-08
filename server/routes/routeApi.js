const router = require("express").Router();

const ctrlUser = require("../controllers/user");
const ctrlProfile = require("../controllers/profile");
const authorization = require("../authorization/tokenVerification");
const ctrlQuestion = require("../controllers/question.controller");
const ctrlAnswer = require("../controllers/answer.controller");

//User API
//Register User Route
router
  .route("/register")
  .get(ctrlUser.renderRegisterModule)
  .post(ctrlUser.registerModule);
//Login User Route
router
  .route("/login")
  .get(ctrlUser.renderLoginModule)
  .post(ctrlUser.loginModule);
//Profile USER Route
router.route("/profile").get(authorization.authorization, ctrlProfile.profile);

//QUESTIONS API
//Fetch ALL the QUESTIONS
//Get QUESTION Route
router
  .route("/questions")
  .get(authorization.authorization, ctrlQuestion.getQuestions);

//|-}~PENDING~{-|
//Fetch QUESTIONS by a particular USER
router
  .route("/:userID/questions")
  .get(authorization.authorization, ctrlQuestion.renderUserQuestions)
  .post(authorization.authorization, ctrlQuestion.userQuestions);

//User is asking a QUESTION
//Create QUESTION Route
router
  .route("/:userID/askQuestion")
  .get(authorization.authorization, ctrlQuestion.renderCreateQuestion)
  .post(authorization.authorization, ctrlQuestion.createQuestion);

//|-}~PENDING~{-|
//Modify a QUESTION Route
router
  .route("/question/:questionID/editQuestion")
  .get(authorization.authorization, ctrlQuestion.renderEditQuestion)
  .put(authorization.authorization, ctrlQuestion.renderEditQuestion);

//|-}~PENDING~{-|
//Answer API
//Get all ANSWERS for particular QUESTION
router.route("/question/:questionID/answers").get(ctrlAnswer.getAnswers);

//Create ANSWER Route
router
  .route("/question/:questionID/giveAnswer")
  .get(authorization.authorization, ctrlAnswer.renderCreateAnswer)
  .post(authorization.authorization, ctrlAnswer.createAnswer);

//|-}~PENDING~{-|
//Fetch an individual QUESTION with ANSWERS
router
  .route("/question/:questionID")
  .get(authorization.authorization, ctrlQuestion.renderUserQuestion)
  .post(authorization.authorization, ctrlQuestion.userQuestion);

module.exports = router;
