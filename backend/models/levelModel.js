const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A level must have a title'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    levelOrder: {
      type: Number,
      required: [true, 'A level must have an order'],
    },
    adminId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A level must belong to an admin'],
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

levelSchema.index({ levelOrder: 1 });

// Virtual populate
levelSchema.virtual('lessons', {
  ref: 'Lesson',
  foreignField: 'levelId',
  localField: '_id',
});

const Level = mongoose.model('Level', levelSchema);

module.exports = Level;
