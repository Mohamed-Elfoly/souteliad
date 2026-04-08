const mongoose = require('mongoose');
const Lesson = require('./lessonModel');

const ratingSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson',
    required: [true, 'A rating must belong to a lesson'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A rating must belong to a user'],
  },
  rating: {
    type: Number,
    required: [true, 'A rating must have a value'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate ratings from the same user on the same lesson
ratingSchema.index({ lessonId: 1, userId: 1 }, { unique: true });

// After saving a rating, recalculate lesson avgRating and numRatings
ratingSchema.statics.calcAvgRating = async function (lessonId) {
  const stats = await this.aggregate([
    { $match: { lessonId } },
    {
      $group: {
        _id: '$lessonId',
        numRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Lesson.findByIdAndUpdate(lessonId, {
      numRatings: stats[0].numRatings,
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await Lesson.findByIdAndUpdate(lessonId, {
      numRatings: 0,
      avgRating: 0,
    });
  }
};

ratingSchema.post('save', function () {
  this.constructor.calcAvgRating(this.lessonId);
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
