const router = require("express").Router();

const ctrlUser = require("../controllers/user");
const ctrlProfile = require("../controllers/profile");
const authorization = require("../authorization/tokenVerification");
const ctrlQuestion = require("../controllers/question.controller");
const ctrlAnswer = require("../controllers/answer.controller");

//User API
//Register User Route
router.route("/users/register").post(ctrlUser.registerModule);
//Login User Route
router.route("/users/login").post(ctrlUser.loginModule);
//Profile USER Route
router.route("/profile").get(authorization.authorization, ctrlProfile.profile);

//QUESTIONS API
//User is asking a QUESTION
//Create QUESTION Route
router
  .route("/:userid/askQuestion")
  .post(authorization.authorization, ctrlQuestion.createQuestion);
//Fetch ALL the QUESTIONS
//Get QUESTION Route
router.route("/questions").get(ctrlQuestion.getQuestions);

//Fetch QUESTIONS by a particular USER
router
  .route("/:userid/questions")
  .get(authorization.authorization, ctrlQuestion.userQuestions);

//Fetch an individual QUESTION
router.route("/questions/:questionid").get(ctrlQuestion.questionAndAnswer);

//|-}~PENDING~{-|
//Modify a QUESTION Route
router
  .route("/questions/:questionid/editQuestion")
  .put(authorization.authorization, ctrlQuestion.editQuestion);

//Answer API
//Create ANSWER Route
router
  .route("/questions/:questionid/giveAnswer")
  .post(authorization.authorization, ctrlAnswer.createAnswer);

module.exports = router;
