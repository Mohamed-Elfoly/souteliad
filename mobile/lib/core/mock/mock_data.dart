import '../../models/level_model.dart';
import '../../models/lesson_model.dart';
import '../../models/quiz_model.dart';
import '../../models/question_model.dart';
import '../../models/post_model.dart';
import '../../models/notification_model.dart';
import '../../models/user_model.dart';
import '../../features/profile/data/user_service.dart';
import '../../features/quiz/data/quiz_service.dart';

// ─── Lessons ─────────────────────────────────────────────────────────────────

const _l1 = LessonModel(
  id: 'lesson-1',
  title: 'الأحرف الهجائية - الجزء الأول',
  description:
      'تعلّم إشارات الأحرف الهجائية العربية من الألف إلى الياء بطريقة سهلة وممتعة.',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnailUrl: null,
  duration: '٥ دقائق',
  avgRating: 4.8,
  numRatings: 120,
  lessonOrder: 1,
  levelId: 'level-1',
  levelTitle: 'المستوى الأول',
);

const _l2 = LessonModel(
  id: 'lesson-2',
  title: 'الأحرف الهجائية - الجزء الثاني',
  description: 'تكملة تعلّم إشارات الأحرف الهجائية العربية.',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnailUrl: null,
  duration: '٦ دقائق',
  avgRating: 4.7,
  numRatings: 98,
  lessonOrder: 2,
  levelId: 'level-1',
  levelTitle: 'المستوى الأول',
);

const _l3 = LessonModel(
  id: 'lesson-3',
  title: 'الأرقام من ١ إلى ١٠',
  description: 'تعلّم إشارات الأرقام العربية من واحد إلى عشرة.',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnailUrl: null,
  duration: '٤ دقائق',
  avgRating: 4.9,
  numRatings: 145,
  lessonOrder: 3,
  levelId: 'level-1',
  levelTitle: 'المستوى الأول',
);

const _l4 = LessonModel(
  id: 'lesson-4',
  title: 'التحيات والمجاملات',
  description: 'تعلّم كيفية إلقاء التحية والتعبير عن المشاعر في لغة الإشارة.',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnailUrl: null,
  duration: '٧ دقائق',
  avgRating: 4.6,
  numRatings: 87,
  lessonOrder: 1,
  levelId: 'level-2',
  levelTitle: 'المستوى الثاني',
);

const _l5 = LessonModel(
  id: 'lesson-5',
  title: 'أفراد العائلة',
  description: 'تعرّف على إشارات أفراد العائلة مثل الأب والأم والأخ والأخت.',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnailUrl: null,
  duration: '٨ دقائق',
  avgRating: 4.5,
  numRatings: 76,
  lessonOrder: 2,
  levelId: 'level-2',
  levelTitle: 'المستوى الثاني',
);

const _l6 = LessonModel(
  id: 'lesson-6',
  title: 'الألوان الأساسية',
  description: 'تعلّم إشارات الألوان الأساسية في لغة الإشارة العربية.',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnailUrl: null,
  duration: '٥ دقائق',
  avgRating: 4.7,
  numRatings: 110,
  lessonOrder: 1,
  levelId: 'level-3',
  levelTitle: 'المستوى الثالث',
);

// ─── Levels ──────────────────────────────────────────────────────────────────

final mockLevels = [
  LevelModel(
    id: 'level-1',
    title: 'المستوى الأول - الأساسيات',
    description: 'الأحرف والأرقام',
    levelOrder: 1,
    lessons: [_l1, _l2, _l3],
  ),
  LevelModel(
    id: 'level-2',
    title: 'المستوى الثاني - الحياة اليومية',
    description: 'التحيات والعائلة',
    levelOrder: 2,
    lessons: [_l4, _l5],
  ),
  LevelModel(
    id: 'level-3',
    title: 'المستوى الثالث - الوصف',
    description: 'الألوان والأشكال',
    levelOrder: 3,
    lessons: [_l6],
  ),
];

final mockLessonsById = {
  'lesson-1': _l1,
  'lesson-2': _l2,
  'lesson-3': _l3,
  'lesson-4': _l4,
  'lesson-5': _l5,
  'lesson-6': _l6,
};

// ─── Quizzes ─────────────────────────────────────────────────────────────────

final mockQuizzes = {
  'lesson-1': QuizModel(
    id: 'quiz-1',
    title: 'اختبار الحروف الهجائية',
    lessonId: 'lesson-1',
    questions: [
      QuestionModel(
        id: 'q-1',
        questionText: 'أيّ إشارة تمثّل حرف الميم؟',
        questionType: 'mcq',
        marks: 2,
        options: [
          const QuestionOptionModel(
              id: 'o-1', text: 'وضع السبابة على الشفتين', isCorrect: true),
          const QuestionOptionModel(
              id: 'o-2', text: 'إبهام للأعلى', isCorrect: false),
          const QuestionOptionModel(
              id: 'o-3', text: 'فتح الكف تجاه الوجه', isCorrect: false),
          const QuestionOptionModel(
              id: 'o-4', text: 'تشبيك السبابتين', isCorrect: false),
        ],
      ),
      QuestionModel(
        id: 'q-2',
        questionText: 'إشارة حرف الباء تشبه رقم؟',
        questionType: 'true-false',
        marks: 1,
        options: [
          const QuestionOptionModel(
              id: 'o-5', text: 'صح', isCorrect: true),
          const QuestionOptionModel(
              id: 'o-6', text: 'خطأ', isCorrect: false),
        ],
      ),
      QuestionModel(
        id: 'q-3',
        questionText: 'ما إشارة حرف السين؟',
        questionType: 'mcq',
        marks: 2,
        options: [
          const QuestionOptionModel(
              id: 'o-7', text: 'ثلاثة أصابع ممدودة', isCorrect: true),
          const QuestionOptionModel(
              id: 'o-8', text: 'قبضة مغلقة', isCorrect: false),
          const QuestionOptionModel(
              id: 'o-9', text: 'إصبعان للأمام', isCorrect: false),
          const QuestionOptionModel(
              id: 'o-10', text: 'الكف مفتوحة للأعلى', isCorrect: false),
        ],
      ),
    ],
  ),
  'lesson-3': QuizModel(
    id: 'quiz-2',
    title: 'اختبار الأرقام',
    lessonId: 'lesson-3',
    questions: [
      QuestionModel(
        id: 'q-10',
        questionText: 'كيف تُعبّر عن رقم ٥ في لغة الإشارة؟',
        questionType: 'mcq',
        marks: 1,
        options: [
          const QuestionOptionModel(
              id: 'o-20', text: 'فتح الكف بالكامل', isCorrect: true),
          const QuestionOptionModel(
              id: 'o-21', text: 'إصبع واحد', isCorrect: false),
          const QuestionOptionModel(
              id: 'o-22', text: 'إصبعان', isCorrect: false),
          const QuestionOptionModel(
              id: 'o-23', text: 'قبضة مغلقة', isCorrect: false),
        ],
      ),
      QuestionModel(
        id: 'q-11',
        questionText: 'رقم ١٠ يُعبَّر عنه بهزّ الإبهام',
        questionType: 'true-false',
        marks: 1,
        options: [
          const QuestionOptionModel(
              id: 'o-24', text: 'صح', isCorrect: true),
          const QuestionOptionModel(
              id: 'o-25', text: 'خطأ', isCorrect: false),
        ],
      ),
    ],
  ),
};

// ─── Student Stats (Home) ────────────────────────────────────────────────────

final mockStudentStats = {
  'currentLesson': 'الأحرف الهجائية - الجزء الثاني',
  'currentLessonId': 'lesson-2',
  'progress': 35,
  'completedLessons': 4,
  'totalLessons': 18,
};

// ─── Posts (Community) ───────────────────────────────────────────────────────

final mockPosts = [
  PostModel(
    id: 'post-1',
    content: 'تعلّمت اليوم إشارة الشكر وكانت سهلة جداً! 🤟 شاركوني تجاربكم',
    author: const PostAuthor(
        id: 'u-1', firstName: 'أحمد', lastName: 'علي', profilePicture: null),
    createdAt: DateTime.now().subtract(const Duration(hours: 2)),
    likesCount: 14,
  ),
  PostModel(
    id: 'post-2',
    content: 'أنهيت المستوى الأول! الحمد لله على هذا الإنجاز 🎉',
    author: const PostAuthor(
        id: 'u-2', firstName: 'سارة', lastName: 'محمد', profilePicture: null),
    createdAt: DateTime.now().subtract(const Duration(hours: 5)),
    likesCount: 32,
  ),
  PostModel(
    id: 'post-3',
    content: 'هل أحد يعرف كيف أحسّن سرعتي في إشارات الأرقام؟ محتاج نصيحة',
    author: const PostAuthor(
        id: 'u-3', firstName: 'خالد', lastName: 'العمر', profilePicture: null),
    createdAt: DateTime.now().subtract(const Duration(days: 1)),
    likesCount: 7,
  ),
  PostModel(
    id: 'post-4',
    content: 'جلسة تدريب مع أخي الأصم اليوم — تقدم رائع! الممارسة هي المفتاح.',
    author: const PostAuthor(
        id: 'u-4', firstName: 'منى', lastName: 'الحسن', profilePicture: null),
    createdAt: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
    likesCount: 21,
  ),
];

// ─── Notifications ───────────────────────────────────────────────────────────

final mockNotifications = [
  NotificationModel(
    id: 'n-1',
    type: 'lesson',
    message: 'تمّ إضافة درس جديد "الأحرف والأرقام - المستوى الأول" في قسم الاستكشاف.',
    read: false,
    createdAt: DateTime.now().subtract(const Duration(hours: 1)),
  ),
  NotificationModel(
    id: 'n-2',
    type: 'quiz',
    message: 'لديك اختبار جديد: اختبار الحروف الهجائية. اختبر مهاراتك الآن!',
    read: false,
    createdAt: DateTime.now().subtract(const Duration(hours: 3)),
  ),
  NotificationModel(
    id: 'n-3',
    type: 'announcement',
    message: 'تقدّمك ممتاز! أكملت ٣٥٪ من المستوى الأول. استمر!',
    read: true,
    createdAt: DateTime.now().subtract(const Duration(days: 1)),
  ),
  NotificationModel(
    id: 'n-4',
    type: 'community',
    message: 'أضاف أحمد علي تعليقاً جديداً في المجتمع. شارك وتفاعل!',
    read: true,
    createdAt: DateTime.now().subtract(const Duration(days: 1, hours: 5)),
  ),
];

// ─── User ────────────────────────────────────────────────────────────────────

final mockUser = UserModel(
  id: 'user-mock-1',
  firstName: 'أحمد',
  lastName: 'علي',
  email: 'ahmed_ali20@gmail.com',
  role: 'student',
  profilePicture: null,
  active: true,
);

// ─── My Grades ───────────────────────────────────────────────────────────────

final mockAttempts = [
  QuizAttemptSummary(
    id: 'attempt-1',
    quizTitle: 'اختبار الحروف الهجائية',
    score: 4,
    totalMarks: 5,
    passed: true,
    createdAt: DateTime.now().subtract(const Duration(days: 2)),
  ),
  QuizAttemptSummary(
    id: 'attempt-2',
    quizTitle: 'اختبار الأرقام',
    score: 1,
    totalMarks: 2,
    passed: true,
    createdAt: DateTime.now().subtract(const Duration(days: 5)),
  ),
  QuizAttemptSummary(
    id: 'attempt-3',
    quizTitle: 'اختبار التحيات',
    score: 2,
    totalMarks: 6,
    passed: false,
    createdAt: DateTime.now().subtract(const Duration(days: 7)),
  ),
];

// ─── Mock submit result ──────────────────────────────────────────────────────

QuizSubmitResult mockSubmitQuiz(List<Map<String, String>> answers, QuizModel quiz) {
  int earned = 0;
  for (final q in quiz.questions) {
    final answer = answers.firstWhere(
      (a) => a['questionId'] == q.id,
      orElse: () => {},
    );
    if (answer.isEmpty) continue;
    final selected = q.options.where((o) => o.id == answer['selectedOptionId']).firstOrNull;
    if (selected != null && selected.isCorrect) {
      earned += q.marks;
    }
  }
  final total = quiz.totalMarks;
  return QuizSubmitResult(
    score: earned,
    totalMarks: total,
    passed: earned >= total * 0.6,
  );
}
