const Like = require('../models/likeModel');
const catchAsync = require('../utils/catchAsync');

exports.toggleLike = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const existingLike = await Like.findOne({ postId, userId });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json({
      status: 'success',
      data: { liked: false },
    });
  }

  await Like.create({ postId, userId });
  return res.status(200).json({
    status: 'success',
    data: { liked: true },
  });
});
