const Quiz = require('../models/quizModel');
const factory = require('./handlerFactory');

exports.setLessonTeacherIds = (req, res, next) => {
  if (!req.body.lessonId) req.body.lessonId = req.params.lessonId;
  if (!req.body.teacherId) req.body.teacherId = req.user.id;
  next();
};

exports.setFilterObj = (req, res, next) => {
  if (req.params.lessonId) req.filterObj = { lessonId: req.params.lessonId };
  next();
};

exports.getAllQuizzes = factory.getAll(Quiz);
exports.getQuiz = factory.getOne(Quiz, { path: 'questions' });
exports.createQuiz = factory.createOne(Quiz);
exports.updateQuiz = factory.updateOne(Quiz);
exports.deleteQuiz = factory.deleteOne(Quiz);
