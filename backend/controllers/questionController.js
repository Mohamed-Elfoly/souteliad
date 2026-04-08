const Question = require('../models/questionModel');
const factory = require('./handlerFactory');

exports.setQuizId = (req, res, next) => {
  if (!req.body.quizId) req.body.quizId = req.params.quizId;
  next();
};

exports.setFilterObj = (req, res, next) => {
  if (req.params.quizId) req.filterObj = { quizId: req.params.quizId };
  next();
};

exports.getAllQuestions = factory.getAll(Question);
exports.getQuestion = factory.getOne(Question);
exports.createQuestion = factory.createOne(Question);
exports.updateQuestion = factory.updateOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);
