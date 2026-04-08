const StudentProgressReport = require('../models/studentProgressReportModel');
const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

// Inject the authenticated teacher's id before create
exports.setTeacherId = (req, res, next) => {
  req.body.teacherId = req.user.id;
  next();
};

// POST /api/v1/progress-reports
exports.createProgressReport = catchAsync(async (req, res, next) => {
  const report = await StudentProgressReport.create(req.body);

  const stars = '★'.repeat(report.rating || 0);
  const lessonLabel = report.lesson ? `في درس "${report.lesson}"` : '';
  await Notification.create({
    type: 'announcement',
    message: `كتب معلمك تقرير تقدم جديد عن مستواك ${lessonLabel} — التقييم: ${stars}`,
    userId: report.studentId,
    teacherId: report.teacherId,
  });

  res.status(201).json({
    status: 'success',
    data: { data: report },
  });
});

// GET /api/v1/progress-reports  (admin/teacher — with student + teacher populated)
exports.getAllProgressReports = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.filterObj) filter = req.filterObj;

  const features = new APIFeatures(
    StudentProgressReport.find(filter)
      .populate({ path: 'studentId', select: 'firstName lastName email' })
      .populate({ path: 'teacherId', select: 'firstName lastName' }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const reports = await features.query;

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: {
      data: reports,
    },
  });
});
