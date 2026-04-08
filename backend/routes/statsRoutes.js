const express = require('express');
const statsController = require('../controllers/statsController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public — no auth required
router.get('/public', statsController.getPublicStats);

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'teacher'));

router.get('/students', statsController.getStudentStats);
router.get('/teacher-dashboard', statsController.getTeacherDashboard);

module.exports = router;
