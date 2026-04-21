const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const commentRouter = require('./commentRoutes');
const likeRouter = require('./likeRoutes');
const reportRouter = require('./reportRoutes');

const router = express.Router();

// Nest child routes
router.use('/:postId/comments', commentRouter);
router.use('/:postId/likes', likeRouter);
router.use('/:postId/reports', reportRouter);

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.setUserId, postController.createPost);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(
    authController.checkPermission('canDeleteContent'),
    postController.checkPostOwnership,
    postController.deletePost
  );

module.exports = router;
