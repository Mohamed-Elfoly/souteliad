const multer = require('multer');
const AppError = require('./appError');

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new AppError('فقط الصور مسموح بها', 400), false);
  }
  cb(null, true);
};

const chatUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

exports.uploadChatImage = chatUpload.single('image');
