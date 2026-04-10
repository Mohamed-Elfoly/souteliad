const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A support ticket must belong to a user'],
  },
  fullName: {
    type: String,
    required: [true, 'A support ticket must have a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A support ticket must have an email'],
    trim: true,
    lowercase: true,
  },
  reason: {
    type: String,
    required: [true, 'A support ticket must have a reason'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'A support ticket must have a message'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'pending', 'resolved'],
    default: 'new',
  },
  adminReply: {
    type: String,
    trim: true,
  },
  repliedAt: {
    type: Date,
  },
  repliedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

supportTicketSchema.index({ userId: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ createdAt: -1 });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
