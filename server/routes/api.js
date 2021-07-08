const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user');
const ctrlQuestion = require('../controllers/question');

router.get('/users', ctrlUser.getUsers);
router.get('/users/:userId', ctrlUser.getSingleUser);
router.post('/users', ctrlUser.createUser);
router.put('/users/:userId', ctrlUser.updateUser);
router.delete('/users/:userId', ctrlUser.deleteUser);

router.get('/questions', ctrlQuestion.getQuestions);
router.get('/questions/:questionId', ctrlQuestion.getSingleQuestion);
router.post('/questions', ctrlQuestion.createQuestion);
router.put('/questions/:questionId', ctrlQuestion.updateQuestion);
router.delete('/questions/:questionId', ctrlQuestion.deleteQuestion);

module.exports = router;