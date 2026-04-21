const express = require('express');
const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  .get(
    authController.restrictTo('teacher', 'admin'),
    authController.checkPermission('canViewReports'),
    reportController.getAllReports
  )
  .post(reportController.setPostUserId, reportController.createReport);

router
  .route('/:id')
  .patch(
    authController.restrictTo('teacher', 'admin'),
    authController.checkPermission('canViewReports'),
    reportController.updateReport
  );

module.exports = router;
