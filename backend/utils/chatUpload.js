const multer = require('multer');
const AppError = require('./appError');

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');
  if (!isImage && !isVideo) {
    return cb(new AppError('فقط الصور والفيديوهات مسموح بها', 400), false);
  }
  cb(null, true);
};

const chatUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB to allow short videos
});

// Accept either image or video field
exports.uploadChatMedia = chatUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);
