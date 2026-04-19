const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  .get(commentController.setFilterObj, commentController.getAllComments)
  .post(commentController.setPostUserId, commentController.createComment);

router
  .route('/:id')
  .delete(
    authController.checkPermission('canDeleteContent'),
    commentController.checkCommentOwnership,
    commentController.deleteComment
  );

module.exports = router;
