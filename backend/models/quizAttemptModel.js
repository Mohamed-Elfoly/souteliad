const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An attempt must belong to a user'],
  },
  quizId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: [true, 'An attempt must belong to a quiz'],
  },
  score: {
    type: Number,
    required: [true, 'An attempt must have a score'],
  },
  totalMarks: {
    type: Number,
    required: [true, 'An attempt must have total marks'],
  },
  passed: {
    type: Boolean,
    required: [true, 'An attempt must have a passed status'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

quizAttemptSchema.index({ userId: 1, quizId: 1 });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;
