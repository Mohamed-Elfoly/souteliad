class AppRoutes {
  AppRoutes._();

  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String signup = '/signup';
  static const String forgotPassword = '/forgot-password';
  static const String verifyCode = '/verify-code';
  static const String resetPassword = '/reset-password';
  static const String authSuccess = '/auth-success';

  static const String home = '/home';
  static const String explore = '/explore';
  static const String lessons = '/lessons';
  static const String level = '/level/:levelId';
  static const String lessonDetail = '/lesson/:lessonId';
  static const String lessonPlayer = '/player/:lessonId';
  static const String quiz = '/quiz/:quizId';
  static const String quizResult = '/quiz-result';

  static const String community = '/community';
  static const String chatAssistant = '/chat';
  static const String notifications = '/notifications';

  static const String profile = '/profile';
  static const String editProfile = '/profile/edit';
  static const String changePassword = '/profile/change-password';
  static const String myGrades = '/profile/grades';
  static const String myLevel = '/profile/my-level';
  static const String support = '/profile/support';
}
