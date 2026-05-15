const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/verifyOtp', authController.verifyOtp);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', upload.single('profilePicture'), userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Admin only routes
router.use(authController.restrictTo('admin'));

router.get('/manage-teachers', userController.getTeachersManage);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
