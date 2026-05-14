const Question = require('../models/questionModel');
const AIPracticeResult = require('../models/aiPracticeResultModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { analyzeSign } = require('../utils/signAI');

// User sends video → AI evaluates (Python HF → Gemini fallback) → result saved → feedback returned
exports.evaluateSign = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;

  if (!req.file) {
    return next(new AppError('Please upload a video of your sign', 400));
  }

  const question = await Question.findById(questionId);

  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  if (question.questionType !== 'ai-practice') {
    return next(
      new AppError('This question is not an AI practice question', 400)
    );
  }

  // Real AI analysis: Python HF service first, Gemini Vision fallback
  const aiResult = await analyzeSign(
    req.file.buffer,
    question.expectedSign,
    req.file.mimetype
  );

  const result = await AIPracticeResult.create({
    userId: req.user.id,
    questionId: question._id,
    accuracy: aiResult.accuracy,
    passed: aiResult.passed,
    feedback: aiResult.feedback,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      resultId: result._id,
      questionId: question._id,
      questionText: question.questionText,
      expectedSign: aiResult.expectedSign,
      detected: aiResult.detected,
      accuracy: aiResult.accuracy,
      passed: aiResult.passed,
      feedback: aiResult.feedback,
      source: aiResult.source,
      top5: aiResult.top5,
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
