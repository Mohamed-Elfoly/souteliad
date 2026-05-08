const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A message must belong to a user'],
  },
  conversationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
    required: [true, 'A message must belong to a conversation'],
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: [true, 'A message must have a role'],
  },
  content: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

chatMessageSchema.index({ conversationId: 1, createdAt: 1 });
chatMessageSchema.index({ user: 1, createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
