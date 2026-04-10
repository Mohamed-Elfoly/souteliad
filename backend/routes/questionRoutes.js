const express = require('express');
const questionController = require('../controllers/questionController');
const authController = require('../controllers/authController');
const { uploadQuestionImage } = require('../utils/lessonUpload');

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  .get(questionController.setFilterObj, questionController.getAllQuestions)
  .post(
    authController.restrictTo('teacher', 'admin'),
    uploadQuestionImage,
    questionController.setQuizId,
    questionController.processImageField,
    questionController.createQuestion
  );

router
  .route('/:id')
  .get(questionController.getQuestion)
  .patch(
    authController.restrictTo('teacher', 'admin'),
    uploadQuestionImage,
    questionController.processImageField,
    questionController.updateQuestion
  )
  .delete(
    authController.restrictTo('teacher', 'admin'),
    questionController.deleteQuestion
  );

module.exports = router;
