const Rating = require('../models/ratingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// POST /lessons/:lessonId/ratings — add a rating (once per user)
exports.addRating = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Please provide a rating between 1 and 5', 400));
  }

  // Check if already rated
  const existing = await Rating.findOne({ lessonId, userId: req.user.id });
  if (existing) {
    return next(new AppError('You have already rated this lesson', 400));
  }

  const newRating = await Rating.create({
    lessonId,
    userId: req.user.id,
    rating,
  });

  return res.status(201).json({
    status: 'success',
    data: {
      data: newRating,
    },
  });
});

// GET /api/v1/ratings/admin — admin fetches all ratings with student + lesson info
exports.getAllRatingsAdmin = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Rating.find()
      .populate('userId', 'firstName lastName email')
      .populate('lessonId', 'title')
      .sort('-createdAt'),
    req.query
  )
    .filter()
    .paginate();

  const ratings = await features.query;

  return res.status(200).json({
    status: 'success',
    results: ratings.length,
    data: { data: ratings },
  });
});

// GET /lessons/:lessonId/ratings/me — get current user's rating for a lesson
exports.getMyRating = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;

  const myRating = await Rating.findOne({ lessonId, userId: req.user.id });

  return res.status(200).json({
    status: 'success',
    data: {
      data: myRating ? myRating.rating : null,
    },
  });
});
