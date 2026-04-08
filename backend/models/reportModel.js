const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'A report must belong to a post'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A report must belong to a user'],
  },
  teacherId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  reason: {
    type: String,
    required: [true, 'A report must have a reason'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.index({ postId: 1 });
reportSchema.index({ status: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
