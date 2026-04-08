const LessonProgress = require('../models/lessonProgressModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.markComplete = catchAsync(async (req, res, next) => {
  const { lessonId } = req.body;

  if (!lessonId) {
    return next(new AppError('Please provide a lessonId', 400));
  }

  // Check if already completed
  const existing = await LessonProgress.findOne({
    userId: req.user.id,
    lessonId,
  });

  if (existing) {
    return next(new AppError('You have already completed this lesson', 400));
  }

  const progress = await LessonProgress.create({
    userId: req.user.id,
    lessonId,
  });

  return res.status(201).json({
    status: 'success',
    data: {
      data: progress,
    },
  });
});

exports.getMyProgress = catchAsync(async (req, res, next) => {
  const progress = await LessonProgress.find({ userId: req.user.id }).populate({
    path: 'lessonId',
    select: 'title',
  });

  return res.status(200).json({
    status: 'success',
    results: progress.length,
    data: {
      data: progress,
    },
  });
});

exports.getUserProgress = catchAsync(async (req, res, next) => {
  const progress = await LessonProgress.find({
    userId: req.params.userId,
  }).populate({
    path: 'lessonId',
    select: 'title',
  });

  return res.status(200).json({
    status: 'success',
    results: progress.length,
    data: {
      data: progress,
    },
  });
});
