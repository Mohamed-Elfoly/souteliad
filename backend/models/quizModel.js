const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A quiz must have a title'],
      trim: true,
    },
    lessonId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lesson',
      required: [true, 'A quiz must belong to a lesson'],
    },
    teacherId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A quiz must belong to a teacher'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

quizSchema.index({ lessonId: 1 });

// Virtual populate
quizSchema.virtual('questions', {
  ref: 'Question',
  foreignField: 'quizId',
  localField: '_id',
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
