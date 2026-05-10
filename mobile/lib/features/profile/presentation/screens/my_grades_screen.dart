import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../data/user_service.dart';

final _myAttemptsProvider = FutureProvider<List<QuizAttemptSummary>>((ref) {
  return userService.getMyAttempts();
});

class MyGradesScreen extends ConsumerWidget {
  const MyGradesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final attemptsAsync = ref.watch(_myAttemptsProvider);

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: const Icon(Icons.arrow_forward_ios,
                        size: 20, color: AppColors.darkText),
                  ),
                  const Spacer(),
                  Text(
                    'درجاتي',
                    style: AppTextStyles.h3
                        .copyWith(color: AppColors.darkText, fontSize: 20),
                  ),
                ],
              ),
            ),

            Expanded(
              child: attemptsAsync.when(
                loading: () => const Center(
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
                error: (e, _) => Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.error_outline,
                          size: 48, color: AppColors.border),
                      const SizedBox(height: 12),
                      Text('حدث خطأ في التحميل',
                          style: AppTextStyles.body
                              .copyWith(color: AppColors.grey)),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: () => ref.invalidate(_myAttemptsProvider),
                        child: const Text('إعادة المحاولة'),
                      ),
                    ],
                  ),
                ),
                data: (attempts) {
                  if (attempts.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.quiz_outlined,
                              size: 64, color: AppColors.border),
                          const SizedBox(height: 16),
                          Text(
                            'لم تقم بأي اختبار بعد',
                            style: AppTextStyles.h3
                                .copyWith(color: AppColors.grey),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'أكمل بعض الدروس وابدأ الاختبارات',
                            style: AppTextStyles.body
                                .copyWith(color: AppColors.grey),
                          ),
                        ],
                      ),
                    );
                  }

                  return ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: attempts.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (_, i) =>
                        _AttemptCard(attempt: attempts[i]),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AttemptCard extends StatelessWidget {
  final QuizAttemptSummary attempt;

  const _AttemptCard({required this.attempt});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF6EA),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          // Score badge
          Container(
            width: 57,
            height: 55,
            decoration: BoxDecoration(
              color: const Color(0xFFEF865F),
              borderRadius: BorderRadius.circular(360),
            ),
            child: Center(
              child: Text(
                '${attempt.percentage}%',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Rubik',
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),

          // Quiz title + status
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  attempt.quizTitle,
                  textAlign: TextAlign.right,
                  style: AppTextStyles.body.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.darkText,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: attempt.passed
                            ? const Color(0xFFD1FAE5)
                            : const Color(0xFFFEE2E2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        attempt.passed ? 'ناجح' : 'راسب',
                        style: TextStyle(
                          fontFamily: 'Rubik',
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: attempt.passed
                              ? const Color(0xFF059669)
                              : const Color(0xFFDC2626),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${attempt.score} / ${attempt.totalMarks}',
                      style: AppTextStyles.caption
                          .copyWith(color: AppColors.grey),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
