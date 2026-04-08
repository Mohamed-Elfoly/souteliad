const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const QuizAttempt = require('../models/quizAttemptModel');
const Quiz = require('../models/quizModel');
const Lesson = require('../models/lessonModel');
const Level = require('../models/levelModel');
const LessonProgress = require('../models/lessonProgressModel');
const StudentProgressReport = require('../models/studentProgressReportModel');

exports.getPublicStats = catchAsync(async (req, res) => {
  const [totalUsers, totalLessons, totalLevels] = await Promise.all([
    User.countDocuments({ role: 'user', active: true }),
    Lesson.countDocuments(),
    Level.countDocuments(),
  ]);

  res.status(200).json({
    status: 'success',
    data: { totalUsers, totalLessons, totalLevels },
  });
});

exports.getStudentStats = catchAsync(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'user' });
  const activeStudents = await User.countDocuments({ role: 'user', active: true });

  const levels = await Level.find().sort('levelOrder');

  const levelBreakdown = await Promise.all(
    levels.map(async (level) => {
      const lessons = await Lesson.find({ levelId: level._id }).select('_id');
      const lessonIds = lessons.map((l) => l._id);
      const quizzes = await Quiz.find({ lessonId: { $in: lessonIds } }).select('_id');
      const quizIds = quizzes.map((q) => q._id);
      const uniqueUsers = await QuizAttempt.distinct('userId', { quizId: { $in: quizIds } });
      return {
        levelId: level._id,
        title: level.title,
        count: uniqueUsers.length,
      };
    })
  );

  res.status(200).json({
    status: 'success',
    data: {
      totalStudents,
      activeStudents,
      levelBreakdown,
    },
  });
});

exports.getTeacherDashboard = catchAsync(async (req, res) => {
  const [totalStudents, activeStudents, totalLessons, totalReports] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', active: true }),
    Lesson.countDocuments(),
    StudentProgressReport.countDocuments({ teacherId: req.user.id }),
  ]);

  const students = await User.find({ role: 'user' }).select('firstName lastName email createdAt profilePicture');

  const studentsWithProgress = await Promise.all(
    students.map(async (student) => {
      const completedLessons = await LessonProgress.countDocuments({ userId: student._id });
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      return { ...student.toObject(), progress, completedLessons };
    })
  );

  res.status(200).json({
    status: 'success',
    data: {
      totalStudents,
      activeStudents,
      totalLessons,
      totalReports,
      students: studentsWithProgress,
    },
  });
});
