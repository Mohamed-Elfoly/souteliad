const Report = require('../models/reportModel');
const factory = require('./handlerFactory');

exports.setPostUserId = (req, res, next) => {
  if (!req.body.postId) req.body.postId = req.params.postId;
  if (!req.body.userId) req.body.userId = req.user.id;
  next();
};

exports.createReport = factory.createOne(Report);
exports.getAllReports = factory.getAll(Report);
exports.updateReport = factory.updateOne(Report);
