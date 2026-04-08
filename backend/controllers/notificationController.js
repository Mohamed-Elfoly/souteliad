const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.getMyNotifications = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Notification.find({ userId: req.user.id }).sort('-createdAt'),
    req.query
  )
    .filter()
    .paginate();

  const notifications = await features.query;

  return res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      data: notifications,
    },
  });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError('No notification found with that ID', 404));
  }

  // Verify ownership
  if (notification.userId.toString() !== req.user.id) {
    return next(
      new AppError('You can only mark your own notifications as read', 403)
    );
  }

  notification.read = true;
  await notification.save();

  return res.status(200).json({
    status: 'success',
    data: {
      data: notification,
    },
  });
});

exports.getUnreadCount = catchAsync(async (req, res, next) => {
  const unreadCount = await Notification.countDocuments({
    userId: req.user.id,
    read: false,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      unreadCount,
    },
  });
});

exports.createNotification = factory.createOne(Notification);
