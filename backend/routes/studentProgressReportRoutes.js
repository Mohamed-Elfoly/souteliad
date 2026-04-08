const express = require('express');
const progressReportController = require('../controllers/studentProgressReportController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(
    authController.restrictTo('teacher', 'admin'),
    progressReportController.getAllProgressReports
  )
  .post(
    authController.restrictTo('teacher', 'admin'),
    progressReportController.setTeacherId,
    progressReportController.createProgressReport
  );

module.exports = router;
