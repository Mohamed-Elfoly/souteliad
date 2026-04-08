const express = require('express');
const multer = require('multer');
const aiPracticeController = require('../controllers/aiPracticeController');
const authController = require('../controllers/authController');

const router = express.Router();

// Multer config — store video in memory (mock AI doesn't need disk storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
});

// Protect all routes
router.use(authController.protect);

// POST /api/v1/ai-practice/:questionId — upload video + get AI feedback
router.post(
  '/:questionId',
  upload.single('video'),
  aiPracticeController.evaluateSign
);

// GET /api/v1/ai-practice/:questionId/my-results — user's practice history
router.get('/:questionId/my-results', aiPracticeController.getMyResults);

module.exports = router;
