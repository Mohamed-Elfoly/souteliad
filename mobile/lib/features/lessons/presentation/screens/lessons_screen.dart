import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../models/lesson_model.dart';
import '../../../../models/quiz_model.dart';
import '../../data/lessons_service.dart';
import '../../../quiz/data/quiz_service.dart';

final _lessonDetailProvider =
    FutureProvider.family<LessonModel, String>((ref, lessonId) {
  return levelsService.getLesson(lessonId);
});

final _lessonQuizProvider =
    FutureProvider.family<QuizModel?, String>((ref, lessonId) {
  return quizService.getQuizByLesson(lessonId);
});

class LessonsScreen extends ConsumerWidget {
  final String lessonId;
  const LessonsScreen({super.key, required this.lessonId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lessonAsync = ref.watch(_lessonDetailProvider(lessonId));

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: lessonAsync.when(
          loading: () => const _LessonLoadingContent(),
          error: (e, _) => Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.wifi_off_outlined,
                    size: 48, color: AppColors.border),
                const SizedBox(height: 12),
                Text('تعذّر تحميل الدرس',
                    style: AppTextStyles.body
                        .copyWith(color: AppColors.textSecondary)),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () =>
                      ref.refresh(_lessonDetailProvider(lessonId)),
                  child: const Text('إعادة المحاولة'),
                ),
              ],
            ),
          ),
          data: (lesson) => _LessonContent(lesson: lesson, lessonId: lessonId),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/chat'),
        backgroundColor: const Color(0xFFF66700),
        elevation: 4,
        child: const Icon(Icons.chat_bubble_outline,
            color: AppColors.white, size: 24),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.startFloat,
    );
  }
}

class _LessonContent extends ConsumerWidget {
  final LessonModel lesson;
  final String lessonId;
  const _LessonContent({required this.lesson, required this.lessonId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quizAsync = ref.watch(_lessonQuizProvider(lessonId));

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          const SizedBox(height: 16),

          // Header — title center, back arrow rightmost
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Spacer to balance
              const SizedBox(width: 40),
              Text(
                'الدروس',
                style: AppTextStyles.h3.copyWith(
                  color: const Color(0xFF373D41),
                  fontWeight: FontWeight.w700,
                  fontSize: 20,
                ),
              ),
              // Back arrow — rightmost, points right = go back in RTL
              GestureDetector(
                onTap: () => context.pop(),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.arrow_forward_ios_rounded,
                      color: Color(0xFF373D41), size: 18),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Thumbnail card
          Container(
            width: double.infinity,
            height: 220,
            decoration: BoxDecoration(
              color: AppColors.white,
              border: Border.all(color: const Color(0xFFDDDEDF)),
              borderRadius: BorderRadius.circular(18),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(17),
              child: lesson.thumbnailUrl != null &&
                      lesson.thumbnailUrl!.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: lesson.thumbnailUrl!,
                      fit: BoxFit.cover,
                      placeholder: (_, __) => const _ThumbnailPlaceholder(),
                      errorWidget: (_, __, ___) =>
                          const _ThumbnailPlaceholder(),
                    )
                  : const _ThumbnailPlaceholder(),
            ),
          ),

          const SizedBox(height: 20),

          // Title + rating row — title right, rating left
          Row(
            textDirection: TextDirection.rtl,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Title — rightmost
              Expanded(
                child: Text(
                  lesson.title,
                  textAlign: TextAlign.right,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.h3.copyWith(
                    color: const Color(0xFF373D41),
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Rating — leftmost
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.star_rounded,
                      color: Color(0xFFFFB800), size: 18),
                  const SizedBox(width: 4),
                  Text(
                    lesson.avgRating.toStringAsFixed(1),
                    style: AppTextStyles.body.copyWith(
                      color: const Color(0xFF868687),
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 16),

          // 3 info chips — rightmost = level (most relevant), then duration, then age
          Row(
            textDirection: TextDirection.rtl,
            children: [
              Expanded(
                child: _InfoChip(
                  icon: Icons.person_outline_rounded,
                  label: lesson.levelTitle ?? 'الأول',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _InfoChip(
                  icon: Icons.access_time_rounded,
                  label: lesson.duration,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _InfoChip(
                  icon: Icons.menu_book_outlined,
                  label: 'جميع الأعمار',
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          const Align(
            alignment: Alignment.centerRight,
            child: Text(
              'نبذة عن الدرس:',
              textDirection: TextDirection.rtl,
              style: TextStyle(
                fontFamily: 'Rubik',
                color: Color(0xFF373D41),
                fontWeight: FontWeight.w700,
                fontSize: 24,
              ),
            ),
          ),
          const SizedBox(height: 8),
          if (lesson.description != null && lesson.description!.isNotEmpty)
            SizedBox(
              width: double.infinity,
              child: Text(
              lesson.description!,
              textAlign: TextAlign.right,
              textDirection: TextDirection.rtl,
              style: AppTextStyles.small.copyWith(
                color: const Color(0xFF868687),
                fontSize: 14,
                height: 2.0,
              ),
            ),
            ),

          const SizedBox(height: 24),

          Align(
            alignment: Alignment.centerRight,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                'خصائص الدرس',
                style: AppTextStyles.body.copyWith(
                  color: const Color(0xFF373D41),
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
            ),
          ),

          const _FeatureRow(
            icon: Icons.public_rounded,
            title: '١٠٠٪ أونلاين',
            subtitle: 'اتعلم في أي وقت يناسبك وبالسرعة اللي تريحك.',
          ),
          const Divider(height: 1, color: Color(0xFFF0F0F0)),
          const _FeatureRow(
            icon: Icons.person_outline_rounded,
            title: 'مناسب للمبتدئين',
            subtitle: 'مش محتاج أي خبرة سابقة بلغة الإشارة.',
          ),
          const Divider(height: 1, color: Color(0xFFF0F0F0)),
          const _FeatureRow(
            icon: Icons.workspace_premium_outlined,
            title: 'موثوق',
            subtitle: 'المحتوى بإشراف متخصصين من كلية التربية الخاصة.',
          ),

          const SizedBox(height: 20),

          _RatingSection(
            lessonId: lesson.id,
            avgRating: lesson.avgRating,
            numRatings: lesson.numRatings,
          ),

          // Primary CTA: watch video
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () => context.push(
                '/player/${lesson.id}',
                extra: {'videoUrl': lesson.videoUrl, 'title': lesson.title},
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20)),
                elevation: 0,
              ),
              child: const Text(
                'ابدأ التعلّم الآن',
                style: TextStyle(
                  fontFamily: 'Rubik',
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
            ),
          ),

          // Quiz CTA — Secondary (shown only when a quiz exists)
          quizAsync.when(
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
            data: (quiz) {
              if (quiz == null) return const SizedBox.shrink();
              return Padding(
                padding: const EdgeInsets.only(top: 12),
                child: SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: OutlinedButton(
                    onPressed: () => context.push('/quiz/${quiz.id}'),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.primary),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20)),
                    ),
                    child: Row(
                      textDirection: TextDirection.rtl,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.quiz_outlined,
                            color: AppColors.primary, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'اختبر مهاراتك',
                          style: TextStyle(
                            fontFamily: 'Rubik',
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.arrow_back_ios_new_rounded,
                            color: AppColors.primary, size: 14),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),

          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

// ── Reusable widgets ──────────────────────────────────────────────────────────

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF6EA),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppColors.primary, size: 24),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AppTextStyles.small.copyWith(
              color: const Color(0xFF373D41),
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  const _FeatureRow(
      {required this.icon, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        textDirection: TextDirection.rtl,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Icon — fixed width so all 3 rows align perfectly
          SizedBox(
            width: 32,
            child: Icon(icon, size: 26, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          // Title + subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  textAlign: TextAlign.right,
                  style: AppTextStyles.small.copyWith(
                    color: const Color(0xFF373D41),
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  textAlign: TextAlign.right,
                  style: AppTextStyles.small.copyWith(
                    color: const Color(0xFF868687),
                    fontSize: 12,
                    height: 1.5,
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

// ── Rating section ────────────────────────────────────────────────────────────

class _RatingSection extends ConsumerStatefulWidget {
  final String lessonId;
  final double avgRating;
  final int numRatings;
  const _RatingSection({
    required this.lessonId,
    required this.avgRating,
    required this.numRatings,
  });

  @override
  ConsumerState<_RatingSection> createState() => _RatingSectionState();
}

class _RatingSectionState extends ConsumerState<_RatingSection> {
  int? _myRating;
  bool _loading = true;
  bool _submitting = false;
  int _hovered = 0;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final r = await levelsService.getMyRating(widget.lessonId);
    if (mounted) setState(() { _myRating = r; _loading = false; });
  }

  Future<void> _submit(int rating) async {
    if (_myRating != null) return;
    setState(() { _myRating = rating; _submitting = true; });
    try {
      await levelsService.submitRating(widget.lessonId, rating);
    } catch (_) {
      // keep optimistic value shown
    } finally {
      if (mounted) setState(() => _submitting = false);
      await Future.delayed(const Duration(milliseconds: 500));
      if (mounted) ref.invalidate(_lessonDetailProvider(widget.lessonId));
    }
  }

  @override
  Widget build(BuildContext context) {
    final displayed = _hovered > 0 ? _hovered : (_myRating ?? 0);
    final hasRated = _myRating != null;

    // read live values from provider so they update after rating
    final lessonAsync = ref.watch(_lessonDetailProvider(widget.lessonId));
    final avgRating = lessonAsync.valueOrNull?.avgRating ?? widget.avgRating;
    final numRatings = lessonAsync.valueOrNull?.numRatings ?? widget.numRatings;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        const Divider(height: 1, color: Color(0xFFF0F0F0)),
        const SizedBox(height: 20),

        // Section title
        Row(
          textDirection: TextDirection.rtl,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // avg stats on left
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.star_rounded, color: Color(0xFFFFB800), size: 16),
                const SizedBox(width: 4),
                Text(
                  avgRating.toStringAsFixed(1),
                  style: const TextStyle(
                    fontFamily: 'Rubik',
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF373D41),
                  ),
                ),
                const SizedBox(width: 4),
                Text(
                  '($numRatings)',
                  style: const TextStyle(
                    fontFamily: 'Rubik',
                    fontSize: 12,
                    color: Color(0xFF868687),
                  ),
                ),
              ],
            ),
            // title on right
            const Text(
              'قيّم هذا الدرس',
              style: TextStyle(
                fontFamily: 'Rubik',
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFF373D41),
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

        // Stars row — centered
        Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(5, (i) {
                final star = i + 1;
                final filled = star <= displayed;
                return GestureDetector(
                  onTap: _submitting ? null : () => _submit(star),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 5),
                    child: Icon(
                      filled ? Icons.star_rounded : Icons.star_outline_rounded,
                      color: filled ? const Color(0xFFFFB800) : const Color(0xFFCCCCCC),
                      size: 40,
                    ),
                  ),
                );
              }),
            ),
          ),

        const SizedBox(height: 10),

        // Status text
        Center(
          child: Text(
            hasRated
                ? 'شكرًا! قيّمت هذا الدرس بـ $_myRating من 5'
                : 'اضغط على النجوم لتقييم الدرس',
            style: TextStyle(
              fontFamily: 'Rubik',
              fontSize: 13,
              color: hasRated ? const Color(0xFF4CAF50) : const Color(0xFF868687),
              fontWeight: hasRated ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ),

        const SizedBox(height: 8),
      ],
    );
  }
}

class _ThumbnailPlaceholder extends StatelessWidget {
  const _ThumbnailPlaceholder();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFFFF6EA),
      child: const Center(
        child: Icon(Icons.play_circle_outline_rounded,
            size: 64, color: AppColors.primary),
      ),
    );
  }
}

class _LessonLoadingContent extends StatelessWidget {
  const _LessonLoadingContent();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          const SizedBox(height: 16),
          Container(
              height: 40,
              decoration: BoxDecoration(
                  color: AppColors.shimmer,
                  borderRadius: BorderRadius.circular(12))),
          const SizedBox(height: 20),
          Container(
              height: 220,
              decoration: BoxDecoration(
                  color: AppColors.shimmer,
                  borderRadius: BorderRadius.circular(18))),
          const SizedBox(height: 20),
          Container(
              height: 28,
              width: 200,
              decoration: BoxDecoration(
                  color: AppColors.shimmer,
                  borderRadius: BorderRadius.circular(8))),
          const SizedBox(height: 16),
          Row(
            children: List.generate(
              3,
              (_) => Expanded(
                child: Container(
                  height: 80,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                      color: AppColors.shimmer,
                      borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          ...List.generate(
            4,
            (_) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Container(
                height: 18,
                decoration: BoxDecoration(
                    color: AppColors.shimmer,
                    borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
