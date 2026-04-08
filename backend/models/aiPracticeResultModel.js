const mongoose = require('mongoose');

const aiPracticeResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A result must belong to a user'],
  },
  questionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
    required: [true, 'A result must belong to a question'],
  },
  accuracy: {
    type: Number,
    required: [true, 'A result must have an accuracy score'],
    min: 0,
    max: 100,
  },
  passed: {
    type: Boolean,
    required: [true, 'A result must have a passed status'],
  },
  feedback: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

aiPracticeResultSchema.index({ userId: 1, questionId: 1 });

const AIPracticeResult = mongoose.model(
  'AIPracticeResult',
  aiPracticeResultSchema
);

module.exports = AIPracticeResult;
