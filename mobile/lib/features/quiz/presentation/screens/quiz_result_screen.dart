import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../providers/stats_provider.dart';
import '../../../../providers/levels_provider.dart';
import '../../../lessons/data/lessons_service.dart';

class QuizResultScreen extends ConsumerStatefulWidget {
  final int score;
  final int totalMarks;
  final bool passed;
  final String? lessonId;
  final String? videoUrl;
  final String? lessonTitle;

  const QuizResultScreen({
    super.key,
    required this.score,
    required this.totalMarks,
    required this.passed,
    this.lessonId,
    this.videoUrl,
    this.lessonTitle,
  });

  @override
  ConsumerState<QuizResultScreen> createState() => _QuizResultScreenState();
}

class _QuizResultScreenState extends ConsumerState<QuizResultScreen> {
  bool _markingComplete = false;
  bool _markedComplete = false;

  @override
  void initState() {
    super.initState();
    debugPrint('=== RESULT SCREEN: passed=${widget.passed} lessonId=${widget.lessonId}');
    if (widget.passed && widget.lessonId != null && widget.lessonId!.isNotEmpty) {
      _markComplete();
    }
  }

  Future<void> _markComplete() async {
    if (_markedComplete || _markingComplete) return;
    setState(() => _markingComplete = true);
    try {
      await levelsService.markLessonComplete(widget.lessonId!);
      if (mounted) {
        ref.invalidate(studentStatsProvider);
        ref.invalidate(levelsProvider);
        setState(() {
          _markedComplete = true;
          _markingComplete = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _markingComplete = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final percentage =
        widget.totalMarks > 0 ? (widget.score / widget.totalMarks * 100).round() : 0;

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Directionality(
            textDirection: TextDirection.rtl,
            child: Column(
              children: [
                const Spacer(),
                _buildIllustration(widget.passed),
                const SizedBox(height: 32),
                Text(
                  widget.passed ? 'أحسنت! لقد اجتزت الاختبار' : 'لم تجتز الاختبار',
                  style: AppTextStyles.h2.copyWith(
                    color: widget.passed ? AppColors.primary : AppColors.error,
                    fontWeight: FontWeight.w700,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  widget.passed
                      ? 'تهانينا! تم احتساب تقدمك في هذا الدرس'
                      : 'لا تيأس، شاهد الدرس مرة أخرى ثم حاول',
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                _buildScoreCard(widget.score, widget.totalMarks, percentage, widget.passed),
                const Spacer(),
                _buildButtons(context),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildIllustration(bool passed) {
    return Container(
      width: 160,
      height: 160,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: passed ? const Color(0xFFFFF0CF) : const Color(0xFFFEE2E2),
        border: Border.all(
          color: passed ? AppColors.primary : AppColors.error,
          width: 3,
        ),
      ),
      child: Center(
        child: Icon(
          passed ? Icons.emoji_events_rounded : Icons.replay_rounded,
          size: 72,
          color: passed ? AppColors.primary : AppColors.error,
        ),
      ),
    );
  }

  Widget _buildScoreCard(int score, int totalMarks, int percentage, bool passed) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: passed ? const Color(0xFFFFF6EA) : const Color(0xFFFFF5F5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: passed ? const Color(0xFFFFCCAA) : const Color(0xFFFCA5A5),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                '$score',
                style: const TextStyle(
                  fontFamily: 'Rubik',
                  fontSize: 56,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                  height: 1,
                ),
              ),
              Text(
                ' / $totalMarks',
                style: AppTextStyles.h3.copyWith(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'درجاتك من الدرجة الكاملة',
            style: AppTextStyles.small.copyWith(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 20),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: totalMarks > 0 ? score / totalMarks : 0,
              minHeight: 10,
              backgroundColor: const Color(0xFFE5E7EB),
              color: passed ? AppColors.primary : AppColors.error,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: passed ? AppColors.successLight : AppColors.errorLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  passed ? 'ناجح' : 'راسب',
                  style: TextStyle(
                    fontFamily: 'Rubik',
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: passed ? AppColors.success : AppColors.error,
                  ),
                ),
              ),
              Text(
                '$percentage%',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: passed ? AppColors.primary : AppColors.error,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildButtons(BuildContext context) {
    if (widget.passed) {
      // Passed → go to home (progress already updated)
      return SizedBox(
        width: double.infinity,
        height: 50,
        child: ElevatedButton(
          onPressed: _markingComplete
              ? null
              : () => context.go(AppRoutes.home),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20)),
            elevation: 0,
          ),
          child: _markingComplete
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                      color: Colors.white, strokeWidth: 2),
                )
              : const Text(
                  'العودة إلى الرئيسية',
                  style: TextStyle(
                    fontFamily: 'Rubik',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
        ),
      );
    }

    // Failed → watch lesson again + retry
    return Column(
      children: [
        // Go back to lesson page to watch + retry
        SizedBox(
          width: double.infinity,
          height: 50,
          child: OutlinedButton(
            onPressed: () {
              if (widget.lessonId != null) {
                context.go('/lesson/${widget.lessonId}');
              } else {
                context.go(AppRoutes.explore);
              }
            },
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppColors.primary),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20)),
            ),
            child: const Text(
              'العودة للدرس',
              style: TextStyle(
                fontFamily: 'Rubik',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
