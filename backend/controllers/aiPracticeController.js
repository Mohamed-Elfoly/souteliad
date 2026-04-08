const Question = require('../models/questionModel');
const AIPracticeResult = require('../models/aiPracticeResultModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { analyzeSign } = require('../utils/mockAI');

// User sends video → mock AI evaluates → result saved to DB → feedback returned
exports.evaluateSign = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;

  // 1) Check video was uploaded
  if (!req.file) {
    return next(new AppError('Please upload a video of your sign', 400));
  }

  // 2) Find the question and verify it's ai-practice type
  const question = await Question.findById(questionId);

  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  if (question.questionType !== 'ai-practice') {
    return next(
      new AppError('This question is not an AI practice question', 400)
    );
  }

  // 3) Run mock AI analysis on the uploaded video
  const aiResult = analyzeSign(question.expectedSign);

  // 4) Save result to DB
  const result = await AIPracticeResult.create({
    userId: req.user.id,
    questionId: question._id,
    accuracy: aiResult.accuracy,
    passed: aiResult.passed,
    feedback: aiResult.feedback,
  });

  // 5) Return feedback to user
  return res.status(200).json({
    status: 'success',
    data: {
      resultId: result._id,
      questionId: question._id,
      questionText: question.questionText,
      expectedSign: aiResult.expectedSign,
      accuracy: aiResult.accuracy,
      passed: aiResult.passed,
      feedback: aiResult.feedback,
    },
  });
});

// Get user's practice history for a question
exports.getMyResults = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;

  const results = await AIPracticeResult.find({
    userId: req.user.id,
    questionId,
  }).sort('-createdAt');

  return res.status(200).json({
    status: 'success',
    results: results.length,
    data: { data: results },
  });
});
