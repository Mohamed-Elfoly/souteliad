import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../models/level_model.dart';
import '../../../../models/lesson_model.dart';
import '../../../../providers/auth_provider.dart';
import '../../data/home_service.dart';
import '../../../../providers/stats_provider.dart';
import '../../../../providers/levels_provider.dart';
import '../../../notifications/presentation/widgets/notifications_dropdown.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _selectedLevelIndex = 0;

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final levelsAsync = ref.watch(levelsProvider);
    final statsAsync = ref.watch(studentStatsProvider);

    return Scaffold(
      backgroundColor: AppColors.white,
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(AppRoutes.chatAssistant),
        backgroundColor: AppColors.primary,
        elevation: 4,
        child: const Icon(Icons.chat_bubble_outline,
            color: AppColors.white, size: 22),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.startFloat,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(studentStatsProvider);
            ref.invalidate(levelsProvider);
          },
          child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const SizedBox(height: 16),

              // ── Header ────────────────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                textDirection: TextDirection.rtl,
                children: [
                  // Greeting — rightmost
                  Text(
                    'مرحبا ${user?.firstName ?? ''} 👋',
                    style: AppTextStyles.h3.copyWith(
                      color: AppColors.darkText,
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  // Bell with dropdown — leftmost
                  const NotificationsBell(),
                ],
              ),

              const SizedBox(height: 16),

              // ── Search bar ────────────────────────────────────────────
              Container(
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(40),
                ),
                child: Row(
                  textDirection: TextDirection.rtl,
                  children: [
                    const SizedBox(width: 16),
                    const Icon(Icons.search,
                        color: AppColors.textHint, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        style: AppTextStyles.body.copyWith(fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'البحث',
                          hintStyle: AppTextStyles.body.copyWith(
                              color: AppColors.textHint, fontSize: 14),
                          border: InputBorder.none,
                          isDense: true,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // ── تقدمك ─────────────────────────────────────────────────
              Align(
                alignment: Alignment.centerRight,
                child: Text(
                  'تقدمك',
                  style: AppTextStyles.h3.copyWith(
                    color: AppColors.darkText,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              levelsAsync.when(
                loading: () => const _ShimmerBox(height: 170),
                error: (_, __) => const SizedBox(),
                data: (levels) {
                  final idx = _selectedLevelIndex.clamp(0, levels.length - 1);
                  final selectedLevel = levels.isNotEmpty ? levels[idx] : null;
                  return statsAsync.when(
                    loading: () => const _ShimmerBox(height: 170),
                    error: (_, __) => _ProgressCard(
                      stats: const {},
                      selectedLevel: selectedLevel,
                      onContinue: () => context.go(AppRoutes.explore),
                    ),
                    data: (stats) => _ProgressCard(
                      stats: stats,
                      selectedLevel: selectedLevel,
                      onContinue: () {
                        if (selectedLevel != null &&
                            selectedLevel.lessons.isNotEmpty) {
                          context.push('/lesson/${selectedLevel.lessons.first.id}');
                        } else {
                          context.go(AppRoutes.explore);
                        }
                      },
                    ),
                  );
                },
              ),

              const SizedBox(height: 24),

              // ── المستويات ─────────────────────────────────────────────
              _SectionHeader(
                title: 'المستويات',
                onMore: () => context.go(AppRoutes.explore),
              ),
              const SizedBox(height: 12),
              levelsAsync.when(
                loading: () => const _ShimmerBox(height: 220),
                error: (_, __) => const SizedBox(),
                data: (levels) => _LevelsTabs(
                  levels: levels,
                  selectedIndex: _selectedLevelIndex,
                  onTabChanged: (i) => setState(() => _selectedLevelIndex = i),
                ),
              ),

              const SizedBox(height: 24),

              // ── دروس مقترحة ───────────────────────────────────────────
              _SectionHeader(
                title: 'دروس مقترحة',
                onMore: () => context.go(AppRoutes.explore),
              ),
              const SizedBox(height: 12),
              levelsAsync.when(
                loading: () => _LessonsGridShimmer(),
                error: (_, __) => const SizedBox(),
                data: (levels) {
                  // درس random من كل level
                  final rng = Random();
                  final suggested = levels
                      .where((l) => l.lessons.isNotEmpty)
                      .map((l) {
                        final idx = rng.nextInt(l.lessons.length);
                        return _SuggestedLesson(
                            lesson: l.lessons[idx], level: l);
                      })
                      .take(4)
                      .toList();
                  return _SuggestedGrid(items: suggested);
                },
              ),

              const SizedBox(height: 100),
            ],
          ),
        ),
        ),
      ),
    );
  }
}

// ─── Progress Card ────────────────────────────────────────────────────────────

class _ProgressCard extends StatelessWidget {
  final Map<String, dynamic> stats;
  final LevelModel? selectedLevel;
  final VoidCallback onContinue;

  const _ProgressCard({
    required this.stats,
    required this.selectedLevel,
    required this.onContinue,
  });

  @override
  Widget build(BuildContext context) {
    final level = selectedLevel;

    // Per-level progress from lessons in the selected level
    final total = level?.lessons.length ?? 0;
    // Use stats levelCompletedLessons only if it matches current level,
    // otherwise show 0 (we don't have per-level progress per tab yet)
    final statsLevelId = stats['currentLevelId'] as String?;
    final completed = (statsLevelId != null &&
            level != null &&
            statsLevelId == level.id)
        ? (stats['levelCompletedLessons'] as num?)?.toInt() ?? 0
        : 0;
    final progress = total > 0 ? completed / total : 0.0;

    // First lesson of selected level
    final firstLesson = level?.lessons.isNotEmpty == true
        ? level!.lessons.first
        : null;

    final lessonName = firstLesson?.title ?? '–';
    final lessonRating = firstLesson?.avgRating;
    final lessonDuration = firstLesson?.duration;
    final levelTitle = level?.title ?? '';

    // Resolve thumbnail
    String? resolvedThumb = firstLesson?.thumbnailUrl;
    if (resolvedThumb != null) {
      if (!resolvedThumb.startsWith('http')) {
        resolvedThumb = 'http://10.0.2.2:3002$resolvedThumb';
      }
      resolvedThumb = resolvedThumb
          .replaceAll('http://localhost:', 'http://10.0.2.2:')
          .replaceAll('http://127.0.0.1:', 'http://10.0.2.2:');
    }

    final String btnLabel = completed == 0 ? 'ابدأ الآن' : 'أكمل';

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFFF6EA),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          // ── Top: thumbnail + info ──
          Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              textDirection: TextDirection.rtl,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Thumbnail
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    width: 80,
                    height: 80,
                    color: const Color(0xFFFFDFB5),
                    child: resolvedThumb != null
                        ? CachedNetworkImage(
                            imageUrl: resolvedThumb,
                            fit: BoxFit.cover,
                            errorWidget: (_, __, ___) =>
                                const _LessonThumbnailIcon(),
                          )
                        : const _LessonThumbnailIcon(),
                  ),
                ),
                const SizedBox(width: 12),

                // Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      // title
                      Text(
                        lessonName,
                        textAlign: TextAlign.right,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyles.bodySemiBold.copyWith(
                          color: const Color(0xFF373D41),
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 6),

                      // meta row
                      Row(
                        textDirection: TextDirection.rtl,
                        children: [
                          if (lessonRating != null && lessonRating > 0) ...[
                            const Icon(Icons.star_rounded,
                                size: 14, color: Color(0xFFFFB800)),
                            const SizedBox(width: 3),
                            Text(
                              lessonRating.toStringAsFixed(1),
                              style: const TextStyle(
                                  fontFamily: 'Rubik',
                                  fontSize: 12,
                                  color: Color(0xFF555555)),
                            ),
                            const SizedBox(width: 10),
                          ],
                          if (lessonDuration != null) ...[
                            const Icon(Icons.access_time_rounded,
                                size: 13, color: Color(0xFF888888)),
                            const SizedBox(width: 3),
                            Text(
                              lessonDuration,
                              style: const TextStyle(
                                  fontFamily: 'Rubik',
                                  fontSize: 12,
                                  color: Color(0xFF555555)),
                            ),
                            const SizedBox(width: 10),
                          ],
                          const Icon(Icons.person_outline_rounded,
                              size: 13, color: Color(0xFF888888)),
                          const SizedBox(width: 3),
                          Flexible(
                            child: Text(
                              levelTitle,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  fontFamily: 'Rubik',
                                  fontSize: 12,
                                  color: Color(0xFF555555)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // ── Divider ──
          const Divider(height: 1, thickness: 1, color: Color(0xFFFFE5B4)),

          // ── Bottom: progress + button ──
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 14),
            child: Row(
              textDirection: TextDirection.rtl,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Row(
                        textDirection: TextDirection.rtl,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${(progress * 100).round()}%',
                            style: const TextStyle(
                                fontFamily: 'Rubik',
                                fontSize: 12,
                                color: Color(0xFF888888)),
                          ),
                          Text(
                            '$completed من $total دروس مكتملة',
                            style: const TextStyle(
                                fontFamily: 'Rubik',
                                fontSize: 12,
                                color: Color(0xFF888888)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Directionality(
                          textDirection: TextDirection.rtl,
                          child: LinearProgressIndicator(
                            value: progress.clamp(0.0, 1.0),
                            minHeight: 7,
                            backgroundColor: Colors.white,
                            valueColor: const AlwaysStoppedAnimation(
                                AppColors.primary),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                SizedBox(
                  height: 36,
                  width: 90,
                  child: ElevatedButton(
                    onPressed: onContinue,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      elevation: 0,
                      padding: EdgeInsets.zero,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20)),
                    ),
                    child: Text(
                      btnLabel,
                      style: const TextStyle(
                        fontFamily: 'Rubik',
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
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

// ─── Levels Tabs ──────────────────────────────────────────────────────────────

class _LevelsTabs extends StatefulWidget {
  final List<LevelModel> levels;
  final int selectedIndex;
  final ValueChanged<int> onTabChanged;
  const _LevelsTabs({
    required this.levels,
    required this.selectedIndex,
    required this.onTabChanged,
  });

  @override
  State<_LevelsTabs> createState() => _LevelsTabsState();
}

class _LevelsTabsState extends State<_LevelsTabs> {
  late int _selected = widget.selectedIndex;

  String _shortName(LevelModel l) {
    const arabic = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس'];
    final i = l.levelOrder - 1;
    return i >= 0 && i < arabic.length ? arabic[i] : 'المستوى ${l.levelOrder}';
  }

  @override
  Widget build(BuildContext context) {
    if (widget.levels.isEmpty) return const SizedBox();
    final selected = widget.levels[_selected];

    return Column(
      children: [
        // Tabs row — RTL: first tab on the right
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            textDirection: TextDirection.rtl,
            children: List.generate(widget.levels.length, (i) {
              final isActive = i == _selected;
              return GestureDetector(
                onTap: () {
                  setState(() => _selected = i);
                  widget.onTabChanged(i);
                },
                child: Container(
                  margin: const EdgeInsets.only(left: 8),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20, vertical: 10),
                  decoration: BoxDecoration(
                    color: isActive
                        ? AppColors.primary
                        : AppColors.background,
                    borderRadius: BorderRadius.circular(40),
                  ),
                  child: Text(
                    _shortName(widget.levels[i]),
                    style: AppTextStyles.body.copyWith(
                      color: isActive
                          ? AppColors.white
                          : AppColors.textSecondary,
                      fontSize: 14,
                      fontWeight: isActive
                          ? FontWeight.w600
                          : FontWeight.w400,
                    ),
                  ),
                ),
              );
            }),
          ),
        ),

        const SizedBox(height: 12),

        // Lessons grid for selected level
        if (selected.lessons.isEmpty)
          const SizedBox()
        else
          Directionality(
            textDirection: TextDirection.rtl,
            child: GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.78,
              ),
              itemCount: selected.lessons.take(4).length,
              itemBuilder: (_, i) => _LessonCard(
                lesson: selected.lessons[i],
                level: selected,
              ),
            ),
          ),
      ],
    );
  }
}

// ─── Suggested Grid ───────────────────────────────────────────────────────────

class _SuggestedLesson {
  final LessonModel lesson;
  final LevelModel level;
  const _SuggestedLesson({required this.lesson, required this.level});
}

class _SuggestedGrid extends StatelessWidget {
  final List<_SuggestedLesson> items;
  const _SuggestedGrid({required this.items});

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox();
    return Directionality(
      textDirection: TextDirection.rtl,
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 0.78,
        ),
        itemCount: items.length,
        itemBuilder: (_, i) => _LessonCard(
          lesson: items[i].lesson,
          level: items[i].level,
        ),
      ),
    );
  }
}

// ─── Lesson Card ──────────────────────────────────────────────────────────────

class _LessonCard extends StatelessWidget {
  final LessonModel lesson;
  final LevelModel level;
  const _LessonCard({required this.lesson, required this.level});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/lesson/${lesson.id}'),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFEEEEEE)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            // Thumbnail
            Expanded(
              flex: 5,
              child: ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(16)),
                child: Container(
                  width: double.infinity,
                  color: const Color(0xFFFFF0CF),
                  child: lesson.thumbnailUrl != null &&
                          lesson.thumbnailUrl!.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: lesson.thumbnailUrl!,
                          fit: BoxFit.cover,
                          errorWidget: (_, __, ___) =>
                              const _LessonThumbnailIcon(),
                        )
                      : const _LessonThumbnailIcon(),
                ),
              ),
            ),

            // Info
            Expanded(
              flex: 4,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Title — always right-aligned
                    SizedBox(
                      width: double.infinity,
                      child: Text(
                        lesson.title,
                        textAlign: TextAlign.right,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyles.body.copyWith(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.darkText,
                        ),
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        // Level — icon RIGHT of text
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text(
                              level.title,
                              style: AppTextStyles.small.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 10,
                              ),
                            ),
                            const SizedBox(width: 3),
                            const Icon(Icons.person_outline_rounded,
                                size: 11,
                                color: AppColors.textSecondary),
                          ],
                        ),
                        const SizedBox(height: 3),
                        // Duration + Rating — icon RIGHT of value
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text(
                              lesson.avgRating.toStringAsFixed(1),
                              style: AppTextStyles.small.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 10,
                              ),
                            ),
                            const SizedBox(width: 2),
                            const Icon(Icons.star_rounded,
                                size: 11,
                                color: Color(0xFFFFB800)),
                            const SizedBox(width: 6),
                            Text(
                              lesson.duration,
                              style: AppTextStyles.small.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 10,
                              ),
                            ),
                            const SizedBox(width: 2),
                            const Icon(Icons.access_time_rounded,
                                size: 11,
                                color: AppColors.textSecondary),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

class _SectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback onMore;
  const _SectionHeader({required this.title, required this.onMore});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      textDirection: TextDirection.rtl,
      children: [
        // Title — rightmost
        Text(
          title,
          style: AppTextStyles.h3.copyWith(
            color: AppColors.darkText,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        // "قراءة المزيد" — leftmost
        GestureDetector(
          onTap: onMore,
          child: Text(
            'قراءة المزيد',
            style: AppTextStyles.body.copyWith(
              color: AppColors.primary,
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }
}

class _MetaChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color iconColor;
  const _MetaChip({
    required this.icon,
    required this.label,
    this.iconColor = AppColors.textSecondary,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      textDirection: TextDirection.rtl,
      children: [
        Icon(icon, size: 13, color: iconColor),
        const SizedBox(width: 3),
        Text(
          label,
          style: AppTextStyles.small.copyWith(
            color: AppColors.textSecondary,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

class _LessonThumbnailIcon extends StatelessWidget {
  const _LessonThumbnailIcon();
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Icon(Icons.play_circle_outline_rounded,
          size: 40, color: AppColors.primary),
    );
  }
}

class _ShimmerBox extends StatelessWidget {
  final double height;
  const _ShimmerBox({required this.height});
  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.shimmer,
        borderRadius: BorderRadius.circular(16),
      ),
    );
  }
}

class _LessonsGridShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.78,
      ),
      itemCount: 4,
      itemBuilder: (_, __) => Container(
        decoration: BoxDecoration(
          color: AppColors.shimmer,
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }
}
