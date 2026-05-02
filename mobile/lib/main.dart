import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'core/constants/app_theme.dart';
import 'core/utils/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Force portrait mode
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const ProviderScope(child: SoutElyadApp()));
}

class SoutElyadApp extends ConsumerStatefulWidget {
  const SoutElyadApp({super.key});

  @override
  ConsumerState<SoutElyadApp> createState() => _SoutElyadAppState();
}

class _SoutElyadAppState extends ConsumerState<SoutElyadApp> {
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _router = ref.read(appRouterProvider);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'صوت اليد',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      routerConfig: _router,
      builder: (context, child) => Directionality(
        textDirection: TextDirection.rtl,
        child: child!,
      ),
    );
  }
}
