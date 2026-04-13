const fs = require('fs');
const path = require('path');
const Lesson = require('../models/lessonModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Save a base64 data URI to disk, return the filename or null
const saveBase64File = (dataUri, folder, prefix, userId) => {
  const match = dataUri.match(/^data:([a-zA-Z0-9+/]+\/[a-zA-Z0-9+/]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1];
  const base64Data = match[2];

  const extMap = {
    'image/jpeg': '.jpg', 'image/jpg': '.jpg', 'image/png': '.png',
    'image/webp': '.webp', 'image/gif': '.gif',
    'video/mp4': '.mp4', 'video/webm': '.webm', 'video/ogg': '.ogv',
  };
  const ext = extMap[mimeType];
  if (!ext) return null;

  const filename = `${prefix}-${userId}-${Date.now()}${ext}`;
  const destDir = path.join(__dirname, '..', 'public', 'uploads', folder);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  fs.writeFileSync(path.join(destDir, filename), Buffer.from(base64Data, 'base64'));
  return filename;
};

exports.setLevelTeacherIds = (req, res, next) => {
  if (!req.body.levelId) req.body.levelId = req.params.levelId;
  if (!req.body.teacherId) req.body.teacherId = req.user.id;
  next();
};

exports.setFilterObj = (req, res, next) => {
  if (req.params.levelId) req.filterObj = { levelId: req.params.levelId };
  next();
};

// Resolve media fields: multer file > base64 > URL string
exports.processMediaFields = (req, res, next) => {
  const files = req.files || {};
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // ── Thumbnail ──
  if (files.thumbnailFile?.[0]) {
    // multer file upload
    req.body.thumbnailUrl = `${baseUrl}/uploads/lessons/images/${files.thumbnailFile[0].filename}`;
  } else if (req.body.thumbnailUrl?.startsWith('data:image/')) {
    // base64 from frontend
    const filename = saveBase64File(req.body.thumbnailUrl, 'lessons/images', 'lesson-img', req.user.id);
    if (filename) req.body.thumbnailUrl = `${baseUrl}/uploads/lessons/images/${filename}`;
    else delete req.body.thumbnailUrl;
  }

  // ── Video ──
  if (files.videoFile?.[0]) {
    // multer file upload
    req.body.videoUrl = `${baseUrl}/uploads/lessons/videos/${files.videoFile[0].filename}`;
  } else if (req.body.videoUrl?.startsWith('data:video/')) {
    // base64 from frontend
    const filename = saveBase64File(req.body.videoUrl, 'lessons/videos', 'lesson-vid', req.user.id);
    if (filename) req.body.videoUrl = `${baseUrl}/uploads/lessons/videos/${filename}`;
    else delete req.body.videoUrl;
  }

  next();
};

exports.getAllLessons = factory.getAll(Lesson);
exports.getLesson = factory.getOne(Lesson, [{ path: 'quizzes' }, { path: 'levelId', select: 'title' }]);

exports.createLesson = catchAsync(async (req, res, next) => {
  // At least one video source must be provided
  if (!req.body.videoUrl) {
    return next(new AppError('A lesson must have a video — upload a file or provide a URL', 400));
  }

  const lesson = await Lesson.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { data: lesson },
  });
});

exports.updateLesson = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!lesson) {
    return next(new AppError('No lesson found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { data: lesson },
  });
});

exports.deleteLesson = factory.deleteOne(Lesson);
