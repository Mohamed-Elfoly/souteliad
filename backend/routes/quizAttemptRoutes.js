const express = require('express');
const quizAttemptController = require('../controllers/quizAttemptController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.post('/', quizAttemptController.submitQuiz);
router.get('/my-attempts', quizAttemptController.getMyAttempts);
router.get('/:id', quizAttemptController.getAttempt);

module.exports = router;
