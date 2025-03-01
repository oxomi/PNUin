const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { getQuestionAndAnswerCount } = require('../controllers/user');

const router = express.Router();

router.get('/user/question-answer-count/:id', isLoggedIn, getQuestionAndAnswerCount);

module.exports = router;