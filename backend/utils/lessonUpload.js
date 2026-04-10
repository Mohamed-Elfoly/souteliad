const multer = require('multer');
const path = require('path');
const AppError = require('./appError');

// ── Lesson image ──────────────────────────────────────────────────────────────
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/lessons/images'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `lesson-img-${req.user.id}-${Date.now()}${ext}`);
  },
});

// ── Lesson video ──────────────────────────────────────────────────────────────
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/lessons/videos'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `lesson-vid-${req.user.id}-${Date.now()}${ext}`);
  },
});

// ── Combined upload (fields: thumbnailFile, videoFile) ───────────────────────
const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'thumbnailFile') {
      cb(null, 'public/uploads/lessons/images');
    } else {
      cb(null, 'public/uploads/lessons/videos');
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'thumbnailFile' ? 'lesson-img' : 'lesson-vid';
    cb(null, `${prefix}-${req.user.id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'thumbnailFile') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new AppError('Only image files are allowed for thumbnail', 400), false);
    }
  } else if (file.fieldname === 'videoFile') {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new AppError('Only video files are allowed for lesson video', 400), false);
    }
  }
  cb(null, true);
};

const lessonUpload = multer({
  storage: combinedStorage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for videos
});

// Upload both fields at once (each optional)
exports.uploadLessonMedia = lessonUpload.fields([
  { name: 'thumbnailFile', maxCount: 1 },
  { name: 'videoFile',     maxCount: 1 },
]);

// ── Question image ────────────────────────────────────────────────────────────
const questionImageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/questions'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `question-img-${req.user.id}-${Date.now()}${ext}`);
  },
});

const questionImageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new AppError('Only image files are allowed for question image', 400), false);
  }
  cb(null, true);
};

exports.uploadQuestionImage = multer({
  storage: questionImageStorage,
  fileFilter: questionImageFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
}).single('imageFile');
