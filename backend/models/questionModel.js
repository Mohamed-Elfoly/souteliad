const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  order: {
    type: Number,
    default: 0,
  },
  questionText: {
    type: String,
    required: [true, 'A question must have text'],
  },
  questionType: {
    type: String,
    enum: ['mcq', 'true-false', 'ai-practice'],
    default: 'mcq',
  },
  marks: {
    type: Number,
    required: [true, 'A question must have marks'],
    default: 1,
  },
  options: {
    type: [
      {
        text: {
          type: String,
          required: [true, 'An option must have text'],
        },
        isCorrect: {
          type: Boolean,
          required: [true, 'An option must specify if it is correct'],
        },
      },
    ],
    required: function () {
      return this.questionType !== 'ai-practice';
    },
    validate: {
      validator(val) {
        if (!val || val.length === 0) return true;
        return val.length >= 2;
      },
      message: 'A question must have at least 2 options',
    },
  },
  expectedSign: {
    type: String,
    required: function () {
      return this.questionType === 'ai-practice';
    },
  },
  expectedType: {
    type: String,
    enum: ['letter', 'number', 'word', 'sentence'],
    default: 'letter',
  },
  imageUrl: {
    type: String,
  },
  quizId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: [true, 'A question must belong to a quiz'],
  },
}, { timestamps: true });

questionSchema.index({ quizId: 1, order: 1, createdAt: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
