const QuizAttempt = require('../models/quizAttemptModel');
const UserAnswer = require('../models/userAnswerModel');
const Question = require('../models/questionModel');
const AIPracticeResult = require('../models/aiPracticeResultModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.submitQuiz = catchAsync(async (req, res, next) => {
  const { quizId, answers } = req.body;

  if (!quizId || !answers || !answers.length) {
    return next(new AppError('Please provide quizId and answers', 400));
  }

  // 1) Fetch all questions for this quiz
  const questions = await Question.find({ quizId });

  if (!questions.length) {
    return next(new AppError('No questions found for this quiz', 404));
  }

  // 2) Calculate score — all question types count toward 60%
  let totalMarks = 0;
  let earnedMarks = 0;
  const aiResults = [];

  for (const question of questions) {
    totalMarks += question.marks;

    if (question.questionType === 'ai-practice') {
      // Look up the user's latest saved AI practice result
      const aiResult = await AIPracticeResult.findOne({
        userId: req.user.id,
        questionId: question._id,
      }).sort('-createdAt');

      if (aiResult) {
        aiResults.push({
          questionId: question._id,
          accuracy: aiResult.accuracy,
          passed: aiResult.passed,
          feedback: aiResult.feedback,
        });
        if (aiResult.passed) {
          earnedMarks += question.marks;
        }
      } else {
        // User didn't practice this sign — 0 marks
        aiResults.push({
          questionId: question._id,
          accuracy: 0,
          passed: false,
          feedback: 'No practice attempt found. You must practice the sign before submitting.',
        });
      }
    } else {
      // MCQ or True-False
      const userAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      if (userAnswer && userAnswer.selectedOptionId !== undefined) {
        const sid = userAnswer.selectedOptionId.toString();
        // Support both: MongoDB _id string OR numeric index
        const selectedOption =
          question.options.id(sid) ??
          question.options[parseInt(sid, 10)];
        if (selectedOption?.isCorrect) {
          earnedMarks += question.marks;
        }
      }
    }
  }

  // 3) Determine if passed (60% threshold)
  const passed = earnedMarks >= totalMarks * 0.6;

  // 4) Create QuizAttempt
  const attempt = await QuizAttempt.create({
    userId: req.user.id,
    quizId,
    score: earnedMarks,
    totalMarks,
    passed,
  });

  // 5) Bulk-create UserAnswers (for MCQ/True-False only)
  const userAnswers = answers
    .filter((a) => a.selectedOptionId !== undefined)
    .map((a) => ({
      attemptId: attempt._id,
      questionId: a.questionId,
      selectedOptionId: a.selectedOptionId,
    }));

  if (userAnswers.length) {
    await UserAnswer.insertMany(userAnswers);
  }

  return res.status(201).json({
    status: 'success',
    data: {
      data: attempt,
      aiResults,
    },
  });
});

exports.getMyAttempts = catchAsync(async (req, res, next) => {
  const attempts = await QuizAttempt.find({ userId: req.user.id }).populate({
    path: 'quizId',
    select: 'title',
  });

  return res.status(200).json({
    status: 'success',
    results: attempts.length,
    data: {
      data: attempts,
    },
  });
});

exports.getAttempt = factory.getOne(QuizAttempt);
