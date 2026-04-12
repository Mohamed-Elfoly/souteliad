// const SupportTicket = require('../models/supportTicketModel');
// const Notification = require('../models/notificationModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');

// // POST /api/v1/support — authenticated user submits a ticket
// exports.createTicket = catchAsync(async (req, res, next) => {
//   const { fullName, email, reason, message } = req.body;

//   const ticket = await SupportTicket.create({
//     userId: req.user.id,
//     fullName,
//     email,
//     reason,
//     message,
//   });

//   res.status(201).json({
//     status: 'success',
//     data: { data: ticket },
//   });
// });

// // GET /api/v1/support/my-tickets — user views their own tickets
// exports.getMyTickets = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(
//     SupportTicket.find({ userId: req.user.id }).sort('-createdAt'),
//     req.query
//   )
//     .filter()
//     .paginate();

//   const tickets = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: tickets.length,
//     data: { data: tickets },
//   });
// });

// // GET /api/v1/support/admin — admin fetches all tickets
// exports.getAllTickets = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(
//     SupportTicket.find().populate('userId', 'firstName lastName email').sort('-createdAt'),
//     req.query
//   )
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tickets = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: tickets.length,
//     data: { data: tickets },
//   });
// });

// // GET /api/v1/support/admin/:id — admin fetches a single ticket
// exports.getTicket = catchAsync(async (req, res, next) => {
//   const ticket = await SupportTicket.findById(req.params.id).populate(
//     'userId',
//     'firstName lastName email'
//   );

//   if (!ticket) {
//     return next(new AppError('No support ticket found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: { data: ticket },
//   });
// });

// // PUT /api/v1/support/admin/:id/reply — admin replies to a ticket
// exports.replyToTicket = catchAsync(async (req, res, next) => {
//   const { adminReply } = req.body;

//   if (!adminReply) {
//     return next(new AppError('Please provide an admin reply', 400));
//   }

//   const ticket = await SupportTicket.findByIdAndUpdate(
//     req.params.id,
//     {
//       adminReply,
//       status: 'resolved',
//       repliedAt: Date.now(),
//       repliedBy: req.user.id,
//     },
//     { new: true, runValidators: true }
//   );

//   if (!ticket) {
//     return next(new AppError('No support ticket found with that ID', 404));
//   }

//   // Create a notification for the student
//   await Notification.create({
//     type: 'support',
//     message: `تم الرد على رسالة الدعم الخاصة بك: "${ticket.reason}"`,
//     link: `/Personal/support`,
//     userId: ticket.userId,
//     adminId: req.user.id,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: { data: ticket },
//   });
// });



const SupportTicket = require('../models/supportTicketModel');
const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// POST /api/v1/support — authenticated user submits a ticket
exports.createTicket = catchAsync(async (req, res, next) => {
  const { fullName, email, reason, message } = req.body;

  const ticket = await SupportTicket.create({
    userId: req.user.id,
    fullName,
    email,
    reason,
    message,
  });

  res.status(201).json({
    status: 'success',
    data: { data: ticket },
  });
});

// GET /api/v1/support/my-tickets — user views their own tickets
exports.getMyTickets = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    SupportTicket.find({ userId: req.user.id }).sort('-createdAt'),
    req.query
  )
    .filter()
    .paginate();

  const tickets = await features.query;

  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: { data: tickets },
  });
});

// GET /api/v1/support/admin — admin fetches all tickets
exports.getAllTickets = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    SupportTicket.find().populate('userId', 'firstName lastName email').sort('-createdAt'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tickets = await features.query;

  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: { data: tickets },
  });
});

// GET /api/v1/support/admin/:id — admin fetches a single ticket
exports.getTicket = catchAsync(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id).populate(
    'userId',
    'firstName lastName email'
  );

  if (!ticket) {
    return next(new AppError('No support ticket found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { data: ticket },
  });
});

// PUT /api/v1/support/admin/:id/reply — admin replies to a ticket
exports.replyToTicket = catchAsync(async (req, res, next) => {
  const { adminReply } = req.body;

  if (!adminReply) {
    return next(new AppError('Please provide an admin reply', 400));
  }

  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    {
      adminReply,
      status: 'resolved',
      repliedAt: Date.now(),
      repliedBy: req.user.id,
    },
    { new: true, runValidators: true }
  );

  if (!ticket) {
    return next(new AppError('No support ticket found with that ID', 404));
  }

  // Create a notification for the student — include the actual admin reply
  await Notification.create({
    type: 'support',
    message: `تم الرد على رسالتك بخصوص "${ticket.reason}":   
    ${adminReply}`,
    link: `/Personal/support`,
    userId: ticket.userId,
    adminId: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: { data: ticket },
  });
});