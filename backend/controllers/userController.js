const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filter out unwanted field names not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'email',
    'phoneNum',
    'profilePicture'
  );

  // If a file was uploaded, set the profilePicture path
  if (req.file) {
    filteredBody.profilePicture = `/uploads/users/${req.file.filename}`;
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNum, level, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return next(new AppError('Please provide firstName, lastName, email and password', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.collection.insertOne({
    firstName,
    lastName,
    email,
    phoneNum: phoneNum || undefined,
    level: level || undefined,
    role: role || 'user',
    password: hashedPassword,
    active: true,
    createdAt: new Date(),
    profilePicture: 'default.jpg',
    permissions: { canViewReports: false, canDeleteContent: false },
  });

  return res.status(201).json({
    status: 'success',
    data: { user: { _id: newUser.insertedId, firstName, lastName, email, role: role || 'user' } },
  });
});

// Admin: get all teachers including inactive ones
exports.getTeachersManage = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: 'teacher', active: { $in: [true, false] } }).select('+active');
  return res.status(200).json({
    status: 'success',
    results: users.length,
    data: { data: users },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const features = new APIFeatures(
    User.find(filter).where({ active: { $in: [true, false] } }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  return res.status(200).json({
    status: 'success',
    results: users.length,
    data: { data: users },
  });
});

exports.getUser = factory.getOne(User);

exports.updateUser = catchAsync(async (req, res, next) => {
  const allowedFields = ['firstName', 'lastName', 'email', 'phoneNum', 'level', 'active', 'permissions'];
  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updateData[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: false,
  });

  if (!user) return next(new AppError('No user found with that ID', 404));

  return res.status(200).json({
    status: 'success',
    data: { data: user },
  });
});

exports.deleteUser = factory.deleteOne(User);
