const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Post = require('../models/postModel');
const factory = require('./handlerFactory');

exports.setUserId = (req, res, next) => {
  if (!req.body.userId) req.body.userId = req.user.id;
  next();
};

exports.checkPostOwnership = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  const isOwner = post.userId.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  const canDeleteContent = req.user.role === 'teacher' && req.user.permissions?.canDeleteContent === true;

  if (!isOwner && !isAdmin && !canDeleteContent) {
    return next(new AppError('You do not have permission to delete this post', 403));
  }

  next();
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.filterObj) filter = req.filterObj;

  const features = new APIFeatures(
    Post.find(filter)
      .populate('userId', 'firstName lastName email profilePicture')
      .populate({ path: 'likes', select: 'userId' })
      .populate({ path: 'comments', select: '_id' }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      data: posts,
    },
  });
});

exports.getPost = factory.getOne(Post, { path: 'comments likes' });
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
