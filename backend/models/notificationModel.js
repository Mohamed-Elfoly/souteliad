const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'A notification must have a type'],
    enum: ['lesson', 'quiz', 'community', 'system', 'announcement', 'support'],
  },
  message: {
    type: String,
    required: [true, 'A notification must have a message'],
  },
  link: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A notification must belong to a user'],
  },
  adminId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  teacherId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
