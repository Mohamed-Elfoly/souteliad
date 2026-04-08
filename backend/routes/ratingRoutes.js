const express = require('express');
const ratingController = require('../controllers/ratingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.post('/', ratingController.addRating);
router.get('/me', ratingController.getMyRating);

module.exports = router;
