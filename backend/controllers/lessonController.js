const Lesson = require('../models/lessonModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { uploadImage } = require('../utils/cloudinary');

// Upload base64 image to Cloudinary, return secure URL or null
const uploadBase64ToCloudinary = async (dataUri, folder) => {
  const match = dataUri.match(/^data:image\/[a-zA-Z+]+;base64,(.+)$/);
  if (!match) return null;
  const buffer = Buffer.from(match[1], 'base64');
  return uploadImage(buffer, folder);
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
exports.processMediaFields = catchAsync(async (req, res, next) => {
  const files = req.files || {};

  // ── Thumbnail ──
  if (files.thumbnailFile?.[0]) {
    req.body.thumbnailUrl = await uploadImage(files.thumbnailFile[0].buffer, 'lessons');
  } else if (req.body.thumbnailUrl?.startsWith('data:image/')) {
    const url = await uploadBase64ToCloudinary(req.body.thumbnailUrl, 'lessons');
    if (url) req.body.thumbnailUrl = url;
    else delete req.body.thumbnailUrl;
  }

  next();
});

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
