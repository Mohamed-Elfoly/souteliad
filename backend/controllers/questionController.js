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

// Resolve imageUrl: uploaded file takes priority over imageUrl string from body
exports.processImageField = (req, res, next) => {
  if (req.file) {
    req.body.imageUrl = `${req.protocol}://${req.get('host')}/uploads/questions/${req.file.filename}`;
  }
  // else: imageUrl stays as whatever string was sent in body (link or undefined)
  next();
};

exports.getAllQuestions = factory.getAll(Question);
exports.getQuestion = factory.getOne(Question);
exports.createQuestion = factory.createOne(Question);
exports.updateQuestion = factory.updateOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);
