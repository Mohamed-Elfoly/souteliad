const multer = require('multer');
const AppError = require('./appError');

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
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

exports.uploadLessonMedia = lessonUpload.fields([
  { name: 'thumbnailFile', maxCount: 1 },
  { name: 'videoFile',     maxCount: 1 },
]);

const questionImageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new AppError('Only image files are allowed for question image', 400), false);
  }
  cb(null, true);
};

exports.uploadQuestionImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: questionImageFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
}).single('imageFile');
