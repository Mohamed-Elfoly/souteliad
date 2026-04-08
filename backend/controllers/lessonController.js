const Lesson = require('../models/lessonModel');
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

exports.getAllLessons = factory.getAll(Lesson);
exports.getLesson = factory.getOne(Lesson, [{ path: 'quizzes' }, { path: 'levelId', select: 'title' }]);
exports.createLesson = factory.createOne(Lesson);
exports.updateLesson = factory.updateOne(Lesson);
exports.deleteLesson = factory.deleteOne(Lesson);
