const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.setPostUserId = (req, res, next) => {
  if (!req.body.postId) req.body.postId = req.params.postId;
  if (!req.body.userId) req.body.userId = req.user.id;
  next();
};

exports.setFilterObj = (req, res, next) => {
  if (req.params.postId) req.filterObj = { postId: req.params.postId };
  next();
};

exports.checkCommentOwnership = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  const isOwner = comment.userId.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  const canDeleteContent = req.user.role === 'teacher' && req.user.permissions?.canDeleteContent === true;

  if (!isOwner && !isAdmin && !canDeleteContent) {
    return next(new AppError('You do not have permission to delete this comment', 403));
  }

  next();
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.filterObj) filter = req.filterObj;

  const features = new APIFeatures(
    Comment.find(filter).populate('userId', 'firstName lastName email profilePicture'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const comments = await features.query;

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      data: comments,
    },
  });
});
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
