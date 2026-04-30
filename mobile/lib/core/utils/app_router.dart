import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// api_client removed — support screen moved to its own file
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/signup_screen.dart';
import '../../features/auth/presentation/screens/forgot_password_screen.dart';
import '../../features/auth/presentation/screens/verify_code_screen.dart';
import '../../features/auth/presentation/screens/reset_password_screen.dart';
import '../../features/auth/presentation/screens/success_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/lessons/presentation/screens/explore_screen.dart';
import '../../features/lessons/presentation/screens/lessons_screen.dart';
import '../../features/lessons/presentation/screens/level_screen.dart';
import '../../features/lessons/presentation/screens/lesson_player_screen.dart';
import '../../features/quiz/presentation/screens/quiz_screen.dart';
import '../../features/quiz/presentation/screens/quiz_result_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';
import '../../features/community/presentation/screens/community_screen.dart';
import '../../features/chat/presentation/screens/chat_screen.dart';
import '../../features/profile/presentation/screens/edit_profile_screen.dart';
import '../../features/profile/presentation/screens/change_password_screen.dart';
import '../../features/profile/presentation/screens/my_grades_screen.dart';
import '../../features/profile/presentation/screens/my_level_screen.dart';
import '../../features/support/presentation/screens/support_screen.dart';
import '../../providers/auth_provider.dart';
import '../constants/app_routes.dart';

class RouterNotifier extends ChangeNotifier {
  final Ref _ref;
  RouterNotifier(this._ref) {
    _ref.listen<AuthState>(authProvider, (_, __) => notifyListeners());
  }

  String? redirect(BuildContext context, GoRouterState state) {
    final authState = _ref.read(authProvider);
    if (authState.isLoading) return null;

    final isLoggedIn = authState.token != null;
    final isAuthRoute = state.matchedLocation == AppRoutes.login ||
        state.matchedLocation == AppRoutes.signup ||
        state.matchedLocation == AppRoutes.splash ||
        state.matchedLocation == AppRoutes.onboarding ||
        state.matchedLocation == AppRoutes.forgotPassword ||
        state.matchedLocation == AppRoutes.verifyCode ||
        state.matchedLocation == AppRoutes.resetPassword ||
        state.matchedLocation == AppRoutes.authSuccess;

    if (!isLoggedIn && !isAuthRoute) return AppRoutes.login;
    if (isLoggedIn && state.matchedLocation == AppRoutes.login) {
      return AppRoutes.home;
    }
    return null;
  }
}

final _routerNotifierProvider = ChangeNotifierProvider<RouterNotifier>(
  (ref) => RouterNotifier(ref),
);

final appRouterProvider = Provider<GoRouter>((ref) {
  ref.keepAlive();
  final notifier = ref.read(_routerNotifierProvider);

  return GoRouter(
    initialLocation: AppRoutes.splash,
    refreshListenable: notifier,
    redirect: notifier.redirect,
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.signup,
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: AppRoutes.forgotPassword,
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: AppRoutes.verifyCode,
        builder: (context, state) => const VerifyCodeScreen(),
      ),
      GoRoute(
        path: AppRoutes.resetPassword,
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>? ?? {};
          return ResetPasswordScreen(
            token: extra['token'] as String? ?? '',
          );
        },
      ),
      GoRoute(
        path: AppRoutes.authSuccess,
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>? ?? {};
          return SuccessScreen(
            title: extra['title'] as String? ?? 'تهانينا!',
            subtitle: extra['subtitle'] as String? ?? '',
            body: extra['body'] as String?,
            nextRoute: extra['nextRoute'] as String? ?? AppRoutes.home,
            isError: extra['isError'] as bool? ?? false,
          );
        },
      ),
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.home,
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: AppRoutes.explore,
            builder: (context, state) => const ExploreScreen(),
          ),
          GoRoute(
            path: AppRoutes.community,
            builder: (context, state) => const CommunityScreen(),
          ),
          GoRoute(
            path: AppRoutes.profile,
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
      // ── Level & Lesson ─────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.level,
        builder: (context, state) {
          final levelId = state.pathParameters['levelId']!;
          return LevelScreen(levelId: levelId);
        },
      ),
      GoRoute(
        path: AppRoutes.lessonDetail,
        builder: (context, state) {
          final lessonId = state.pathParameters['lessonId']!;
          return LessonsScreen(lessonId: lessonId);
        },
      ),
      GoRoute(
        path: '/player/:lessonId',
        builder: (context, state) {
          final lessonId = state.pathParameters['lessonId']!;
          final extra = state.extra as Map<String, dynamic>? ?? {};
          return LessonPlayerScreen(
            lessonId: lessonId,
            videoUrl: extra['videoUrl'] as String? ?? '',
            title: extra['title'] as String? ?? '',
          );
        },
      ),
      // ── Quiz ───────────────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.quiz,
        builder: (context, state) {
          final quizId = state.pathParameters['quizId']!;
          return QuizScreen(quizId: quizId);
        },
      ),
      GoRoute(
        path: AppRoutes.quizResult,
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>? ?? {};
          return QuizResultScreen(
            score: (extra['score'] as num?)?.toInt() ?? 0,
            totalMarks: (extra['totalMarks'] as num?)?.toInt() ?? 0,
            passed: extra['passed'] as bool? ?? false,
            lessonId: extra['lessonId'] as String?,
            videoUrl: extra['videoUrl'] as String?,
            lessonTitle: extra['lessonTitle'] as String?,
          );
        },
      ),
      // ── Chat ───────────────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.chatAssistant,
        builder: (context, state) => const ChatScreen(),
      ),
      // ── Notifications (outside ShellRoute = no bottom nav) ────────
      GoRoute(
        path: AppRoutes.notifications,
        builder: (context, state) => const NotificationsScreen(),
      ),
      // ── Profile sub-pages (outside ShellRoute = no bottom nav) ─────
      GoRoute(
        path: AppRoutes.editProfile,
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: AppRoutes.changePassword,
        builder: (context, state) => const ChangePasswordScreen(),
      ),
      GoRoute(
        path: AppRoutes.myGrades,
        builder: (context, state) => const MyGradesScreen(),
      ),
      GoRoute(
        path: AppRoutes.myLevel,
        builder: (context, state) => const MyLevelScreen(),
      ),
      GoRoute(
        path: AppRoutes.support,
        builder: (context, state) => const SupportScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('الصفحة غير موجودة: ${state.error}'),
      ),
    ),
  );
});

class MainShell extends ConsumerStatefulWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  ConsumerState<MainShell> createState() => _MainShellState();
}

class _MainShellState extends ConsumerState<MainShell> {
  final _tabs = [
    AppRoutes.home,
    AppRoutes.explore,
    AppRoutes.community,
    AppRoutes.profile,
  ];

  int _indexFromLocation(String location) {
    for (var i = 0; i < _tabs.length; i++) {
      if (location.startsWith(_tabs[i])) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    final currentIndex = _indexFromLocation(location);

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index) {
          context.go(_tabs[index]);
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'الرئيسية'),
          BottomNavigationBarItem(icon: Icon(Icons.menu_book_outlined), activeIcon: Icon(Icons.menu_book), label: 'الدروس'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline_rounded), activeIcon: Icon(Icons.chat_bubble_rounded), label: 'المجتمع'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'حسابي'),
        ],
      ),
    );
  }
}
