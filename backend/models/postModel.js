const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'A post must have content'],
      trim: true,
    },
    mediaUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'hidden', 'deleted'],
      default: 'active',
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A post must belong to a user'],
    },
    teacherId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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

postSchema.index({ userId: 1 });
postSchema.index({ createdAt: -1 });

// Virtual populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'postId',
  localField: '_id',
});

postSchema.virtual('likes', {
  ref: 'Like',
  foreignField: 'postId',
  localField: '_id',
});

// Filter out deleted posts by default
postSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 'deleted' } });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
