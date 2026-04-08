const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Progress must belong to a user'],
  },
  lessonId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson',
    required: [true, 'Progress must belong to a lesson'],
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate completion
lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const LessonProgress = mongoose.model('LessonProgress', lessonProgressSchema);

module.exports = LessonProgress;
