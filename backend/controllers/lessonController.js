const Lesson = require('../models/lessonModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setLevelTeacherIds = (req, res, next) => {
  if (!req.body.levelId) req.body.levelId = req.params.levelId;
  if (!req.body.teacherId) req.body.teacherId = req.user.id;
  next();
};

exports.setFilterObj = (req, res, next) => {
  if (req.params.levelId) req.filterObj = { levelId: req.params.levelId };
  next();
};

// Resolve media fields: prefer uploaded file, fall back to URL string from body
exports.processMediaFields = (req, res, next) => {
  const files = req.files || {};

  // Thumbnail: uploaded file takes priority over thumbnailUrl string
  if (files.thumbnailFile && files.thumbnailFile[0]) {
    req.body.thumbnailUrl = `${req.protocol}://${req.get('host')}/uploads/lessons/images/${files.thumbnailFile[0].filename}`;
  }
  // else: thumbnailUrl stays as whatever string was sent in body (link or undefined)

  // Video: uploaded file takes priority over videoUrl string
  if (files.videoFile && files.videoFile[0]) {
    req.body.videoUrl = `${req.protocol}://${req.get('host')}/uploads/lessons/videos/${files.videoFile[0].filename}`;
  }
  // else: videoUrl stays as whatever string was sent in body (link or undefined)

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
