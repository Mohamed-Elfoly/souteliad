import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../models/level_model.dart';
import '../../../../models/lesson_model.dart';
import '../../data/lessons_service.dart';

final _levelDetailProvider =
    FutureProvider.family<LevelModel, String>((ref, levelId) {
  return levelsService.getLevel(levelId);
});

class LevelScreen extends ConsumerWidget {
  final String levelId;
  const LevelScreen({super.key, required this.levelId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final levelAsync = ref.watch(_levelDetailProvider(levelId));

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: levelAsync.when(
          loading: () => const _LevelLoadingContent(),
          error: (e, _) => Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.wifi_off_outlined,
                    size: 48, color: AppColors.border),
                const SizedBox(height: 12),
                Text(
                  'تعذّر تحميل المستوى',
                  style: AppTextStyles.body
                      .copyWith(color: AppColors.textSecondary),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () =>
                      ref.refresh(_levelDetailProvider(levelId)),
                  child: const Text('إعادة المحاولة'),
                ),
              ],
            ),
          ),
          data: (level) => _LevelContent(level: level),
        ),
      ),
    );
  }
}

class _LevelContent extends StatelessWidget {
  final LevelModel level;
  const _LevelContent({required this.level});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        const SizedBox(height: 16),

        // Header: title center, back arrow on right (RTL)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Spacer to balance
              const SizedBox(width: 40),

              // Title
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Text(
                    'المستوى ${level.levelOrder}',
                    textAlign: TextAlign.center,
                    style: AppTextStyles.h3.copyWith(
                      color: const Color(0xFF373D41),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),

              // Back arrow — rightmost, points right (= go back in RTL)
              GestureDetector(
                onTap: () => context.pop(),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.arrow_forward_ios_rounded,
                    color: Color(0xFF373D41),
                    size: 18,
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Level description (grey bold)
        if (level.description != null && level.description!.isNotEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              level.description!,
              textAlign: TextAlign.right,
              style: AppTextStyles.body.copyWith(
                color: const Color(0xFF666667),
                fontWeight: FontWeight.w700,
                fontSize: 18,
              ),
            ),
          ),

        const SizedBox(height: 8),

        // "الدروس:" label
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'الدروس:',
            textAlign: TextAlign.right,
            style: AppTextStyles.h3.copyWith(
              color: const Color(0xFF373D41),
              fontWeight: FontWeight.w700,
            ),
          ),
        ),

        const SizedBox(height: 8),

        // Lessons list
        Expanded(
          child: level.lessons.isEmpty
              ? Center(
                  child: Text(
                    'لا توجد دروس في هذا المستوى',
                    style: AppTextStyles.body
                        .copyWith(color: AppColors.textSecondary),
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 4),
                  itemCount: level.lessons.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, i) =>
                      _LessonCard(lesson: level.lessons[i]),
                ),
        ),

        const SizedBox(height: 16),
      ],
    );
  }
}

class _LessonCard extends StatelessWidget {
  final LessonModel lesson;
  const _LessonCard({required this.lesson});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/lesson/${lesson.id}'),
      child: Container(
        padding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        decoration: BoxDecoration(
          color: const Color(0xFFFFF2E7),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          textDirection: TextDirection.ltr,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Chevron — leftmost, points left (= go forward in RTL)
            const Icon(
              Icons.chevron_left_rounded,
              color: AppColors.primary,
              size: 26,
            ),

            // Lesson title — rightmost
            Expanded(
              child: Text(
                '${lesson.lessonOrder}. ${lesson.title}',
                textAlign: TextAlign.right,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: AppTextStyles.body.copyWith(
                  color: const Color(0xFF666667),
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LevelLoadingContent extends StatelessWidget {
  const _LevelLoadingContent();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          const SizedBox(height: 16),
          Container(
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.shimmer,
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          const SizedBox(height: 20),
          Container(
            height: 24,
            width: 200,
            decoration: BoxDecoration(
              color: AppColors.shimmer,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(height: 12),
          ...List.generate(
            6,
            (_) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                height: 64,
                decoration: BoxDecoration(
                  color: AppColors.shimmer,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
