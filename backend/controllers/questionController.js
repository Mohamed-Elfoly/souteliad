const Question = require('../models/questionModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const { uploadImage } = require('../utils/cloudinary');

exports.setQuizId = (req, res, next) => {
  if (!req.body.quizId) req.body.quizId = req.params.quizId;
  next();
};

exports.setFilterObj = (req, res, next) => {
  if (req.params.quizId) req.filterObj = { quizId: req.params.quizId };
  // Default sort: by manual order field, then by creation time (oldest first)
  if (!req.query.sort) req.query.sort = 'order,createdAt';
  next();
};

// Resolve imageUrl: uploaded file → Cloudinary, else keep URL string from body
exports.processImageField = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.imageUrl = await uploadImage(req.file.buffer, 'questions');
  }
  next();
});

exports.getAllQuestions = factory.getAll(Question);
exports.getQuestion = factory.getOne(Question);
exports.createQuestion = factory.createOne(Question);
exports.updateQuestion = factory.updateOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);
