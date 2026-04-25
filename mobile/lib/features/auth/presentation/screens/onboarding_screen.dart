import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../core/constants/app_text_styles.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  final List<_OnboardingData> _pages = [
    _OnboardingData(
      bgColor: const Color(0xFFFFF0CF),
      title: 'الإيد بتتكلم… وإحنا بنسمع!',
      subtitle: 'ادخل عالم ممتع تتعلم فيه لغة الإشارة بطريقة بسيطة ولذيذة.',
      illustration: const _Illustration1(),
    ),
    _OnboardingData(
      bgColor: const Color(0xFFFFF0CF),
      title: 'تعليم خفيف… يخلي الإشارة سهلة!',
      subtitle:
          'دروس مرسومة بحب، صور ملونة، ومحتوى موثوق من كلية التربية الخاصة.',
      illustration: const _Illustration2(),
    ),
    _OnboardingData(
      bgColor: const Color(0xFFFFF0CF),
      title: 'إحنا معاك… خطوة بخطوة!',
      subtitle:
          'مساحة لطيفة وآمنة للأهالي والطلاب… تتعلموا فيها وتستمتعوا من غير أي توتر.',
      illustration: const _Illustration3(),
    ),
  ];

  void _next() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    }
  }

  void _skip() => context.go(AppRoutes.login);

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLast = _currentPage == _pages.length - 1;

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Skip button row
              SizedBox(
                height: 48,
                child: !isLast
                    ? TextButton(
                        onPressed: _skip,
                        child: Text(
                          'تخطي',
                          style: AppTextStyles.bodySemiBold.copyWith(
                            color: const Color(0xFF373D41),
                            fontSize: 16,
                          ),
                        ),
                      )
                    : const SizedBox(),
              ),
              const SizedBox(height: 8),

              // PageView
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (i) => setState(() => _currentPage = i),
                  itemCount: _pages.length,
                  itemBuilder: (_, index) =>
                      _OnboardingPage(data: _pages[index]),
                ),
              ),

              const SizedBox(height: 24),

              // Page indicator
              Center(
                child: SmoothPageIndicator(
                  controller: _pageController,
                  count: _pages.length,
                  effect: const ExpandingDotsEffect(
                    activeDotColor: AppColors.primary,
                    dotColor: Color(0xFFD9D9D9),
                    dotHeight: 8,
                    dotWidth: 8,
                    expansionFactor: 3,
                    spacing: 6,
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Action buttons
              if (!isLast)
                _PrimaryButton(label: 'التالي', onTap: _next)
              else ...[
                _PrimaryButton(
                  label: 'ابدأ الآن',
                  onTap: () => context.go(AppRoutes.signup),
                ),
                const SizedBox(height: 16),
                _OutlinedActionButton(
                  label: 'تسجيل الدخول',
                  onTap: () => context.go(AppRoutes.login),
                ),
              ],

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

class _OnboardingPage extends StatelessWidget {
  final _OnboardingData data;
  const _OnboardingPage({required this.data});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Illustration card
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Container(
              width: double.infinity,
              color: data.bgColor,
              child: data.illustration,
            ),
          ),
        ),

        const SizedBox(height: 32),

        // Title
        Text(
          data.title,
          textAlign: TextAlign.center,
          style: AppTextStyles.h2.copyWith(color: const Color(0xFF373D41)),
        ),

        const SizedBox(height: 12),

        // Subtitle
        Text(
          data.subtitle,
          textAlign: TextAlign.center,
          style: AppTextStyles.body.copyWith(
            color: const Color(0xFF666667),
            fontSize: 16,
            height: 1.6,
          ),
        ),
      ],
    );
  }
}

class _PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _PrimaryButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          elevation: 0,
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontFamily: 'Rubik',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.white,
          ),
        ),
      ),
    );
  }
}

class _OutlinedActionButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _OutlinedActionButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: AppColors.primary),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontFamily: 'Rubik',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFF373D41),
          ),
        ),
      ),
    );
  }
}

class _OnboardingData {
  final Color bgColor;
  final String title;
  final String subtitle;
  final Widget illustration;

  const _OnboardingData({
    required this.bgColor,
    required this.title,
    required this.subtitle,
    required this.illustration,
  });
}

// ── Illustrations ─────────────────────────────────────────────────────────────

class _Illustration1 extends StatelessWidget {
  const _Illustration1();
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              color: const Color(0xFFEB6837).withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.sign_language_rounded,
                size: 80, color: Color(0xFFEB6837)),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _HandBubble(icon: Icons.waving_hand_rounded, delay: 0),
              const SizedBox(width: 16),
              _HandBubble(icon: Icons.front_hand_rounded, delay: 1),
              const SizedBox(width: 16),
              _HandBubble(icon: Icons.back_hand_rounded, delay: 2),
            ],
          ),
        ],
      ),
    );
  }
}

class _Illustration2 extends StatelessWidget {
  const _Illustration2();
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              color: const Color(0xFFEB6837).withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.menu_book_rounded,
                size: 80, color: Color(0xFFEB6837)),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _LessonChip(label: 'أ'),
              const SizedBox(width: 10),
              _LessonChip(label: 'ب'),
              const SizedBox(width: 10),
              _LessonChip(label: 'ت'),
              const SizedBox(width: 10),
              _LessonChip(label: '١'),
              const SizedBox(width: 10),
              _LessonChip(label: '٢'),
            ],
          ),
        ],
      ),
    );
  }
}

class _Illustration3 extends StatelessWidget {
  const _Illustration3();
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              color: const Color(0xFFEB6837).withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.groups_rounded,
                size: 80, color: Color(0xFFEB6837)),
          ),
          const SizedBox(height: 24),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.06),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.favorite_rounded,
                    color: Color(0xFFEB6837), size: 20),
                SizedBox(width: 8),
                Text(
                  'تعلّم معنا بأمان',
                  style: TextStyle(
                    fontFamily: 'Rubik',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF373D41),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _HandBubble extends StatelessWidget {
  final IconData icon;
  final int delay;
  const _HandBubble({required this.icon, required this.delay});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 52,
      height: 52,
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Icon(icon, color: const Color(0xFFEB6837), size: 28),
    );
  }
}

class _LessonChip extends StatelessWidget {
  final String label;
  const _LessonChip({required this.label});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Center(
        child: Text(
          label,
          style: const TextStyle(
            fontFamily: 'Rubik',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFFEB6837),
          ),
        ),
      ),
    );
  }
}
