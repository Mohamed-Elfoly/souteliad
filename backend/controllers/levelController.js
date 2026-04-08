const Level = require('../models/levelModel');
const factory = require('./handlerFactory');

exports.setAdminId = (req, res, next) => {
  if (!req.body.adminId) req.body.adminId = req.user.id;
  next();
};

exports.getAllLevels = factory.getAll(Level);
exports.getLevel = factory.getOne(Level, { path: 'lessons' });
exports.createLevel = factory.createOne(Level);
exports.updateLevel = factory.updateOne(Level);
exports.deleteLevel = factory.deleteOne(Level);
