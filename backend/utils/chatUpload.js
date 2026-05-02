const multer = require('multer');
const path = require('path');
const AppError = require('./appError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/chat'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `chat-img-${req.user.id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new AppError('فقط الصور مسموح بها', 400), false);
  }
  cb(null, true);
};

const chatUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

exports.uploadChatImage = chatUpload.single('image');
