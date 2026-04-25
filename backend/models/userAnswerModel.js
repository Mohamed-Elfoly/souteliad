const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
  attemptId: {
    type: mongoose.Schema.ObjectId,
    ref: 'QuizAttempt',
    required: [true, 'An answer must belong to an attempt'],
  },
  questionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
    required: [true, 'An answer must belong to a question'],
  },
  selectedOptionId: {
    type: String,
    required: [true, 'An answer must have a selected option'],
  },
});

userAnswerSchema.index({ attemptId: 1 });

const UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);

module.exports = UserAnswer;
