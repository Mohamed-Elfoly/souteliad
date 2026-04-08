const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A lesson must have a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'A lesson must have a video URL'],
    },
    thumbnailUrl: {
      type: String,
    },
    duration: {
      type: String,
      default: '0:00',
    },
    avgRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must be at most 5'],
    },
    numRatings: {
      type: Number,
      default: 0,
    },
    lessonOrder: {
      type: Number,
      required: [true, 'A lesson must have an order'],
    },
    levelId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Level',
      required: [true, 'A lesson must belong to a level'],
    },
    teacherId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A lesson must belong to a teacher'],
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

lessonSchema.index({ levelId: 1, lessonOrder: 1 }, { unique: true });

// Virtual populate
lessonSchema.virtual('quizzes', {
  ref: 'Quiz',
  foreignField: 'lessonId',
  localField: '_id',
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
