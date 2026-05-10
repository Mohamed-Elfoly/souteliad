const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const QuizAttempt = require('../models/quizAttemptModel');
const Quiz = require('../models/quizModel');
const Lesson = require('../models/lessonModel');
const Level = require('../models/levelModel');
const LessonProgress = require('../models/lessonProgressModel');
const StudentProgressReport = require('../models/studentProgressReportModel');

exports.getMyStats = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const [allLessons, completedProgress, attempts] = await Promise.all([
    Lesson.find()
      .populate('levelId', 'title levelOrder')
      .sort({ levelId: 1, lessonOrder: 1 })
      .select('_id title levelId lessonOrder avgRating duration thumbnailUrl'),
    LessonProgress.find({ userId }).select('lessonId'),
    QuizAttempt.find({ userId }).select('passed score totalMarks'),
  ]);

  const completedIds = new Set(completedProgress.filter((p) => p.lessonId).map((p) => p.lessonId.toString()));
  const totalLessons = allLessons.length;
  const completedLessons = completedIds.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const nextLesson = allLessons.find((l) => !completedIds.has(l._id.toString())) ?? allLessons.at(-1);

  let levelTotalLessons = 0;
  let levelCompletedLessons = 0;
  let levelProgress = 0;

  const nextLevelId = nextLesson?.levelId?._id ?? nextLesson?.levelId;
  if (nextLevelId) {
    const lvId = nextLevelId.toString();
    const lvLessons = allLessons.filter((l) => {
      const lid = l.levelId?._id ?? l.levelId;
      return lid && lid.toString() === lvId;
    });
    levelTotalLessons = lvLessons.length;
    levelCompletedLessons = lvLessons.filter((l) => completedIds.has(l._id.toString())).length;
    levelProgress = levelTotalLessons > 0 ? Math.round((levelCompletedLessons / levelTotalLessons) * 100) : 0;
  }

  const totalQuizzes = attempts.length;
  const passedQuizzes = attempts.filter((a) => a.passed).length;
  const avgScore = totalQuizzes > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.totalMarks > 0 ? (a.score / a.totalMarks) * 100 : 0), 0) / totalQuizzes)
    : 0;

  res.status(200).json({
    status: 'success',
    data: {
      completedLessons,
      totalLessons,
      progressPercent,
      levelTotalLessons,
      levelCompletedLessons,
      levelProgress,
      currentLessonId: nextLesson?._id ?? null,
      currentLesson: nextLesson?.title ?? null,
      currentLessonRating: nextLesson?.avgRating ?? null,
      currentLessonDuration: nextLesson?.duration ?? null,
      currentLessonThumbnail: nextLesson?.thumbnailUrl ?? null,
      currentLevelId: nextLesson?.levelId?._id ?? nextLesson?.levelId ?? null,
      totalQuizzes,
      passedQuizzes,
      avgScore,
    },
  });
});

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
