const Level = require('../models/levelModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setAdminId = (req, res, next) => {
  if (!req.body.adminId) req.body.adminId = req.user.id;
  next();
};

exports.getAllLevels = factory.getAll(Level);

exports.getAllLevelsWithLessons = catchAsync(async (req, res) => {
  const levels = await Level.find()
    .sort({ createdAt: 1 })
    .populate({ path: 'lessons', options: { sort: { lessonOrder: 1 } } });

  res.status(200).json({
    status: 'success',
    results: levels.length,
    data: { data: levels },
  });
});

exports.getLevel = factory.getOne(Level, { path: 'lessons' });
exports.createLevel = factory.createOne(Level);
exports.updateLevel = factory.updateOne(Level);
exports.deleteLevel = factory.deleteOne(Level);
