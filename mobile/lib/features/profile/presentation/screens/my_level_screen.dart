import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../models/level_model.dart';
import '../../../../providers/levels_provider.dart';
import '../../../../providers/stats_provider.dart';

// Ordered palette — index 0 = level 1
const _levelColors = [
  Color(0xFF6B2737), // level 1 — deep red
  Color(0xFFB85C38), // level 2 — burnt orange
  Color(0xFFE07B54), // level 3 — warm orange
  Color(0xFFE8A87C), // level 4 — peach
  Color(0xFFF2C4A0), // level 5 — light peach
  Color(0xFFF7DFC0), // level 6+
];

Color _colorForLevel(int order) {
  final i = (order - 1).clamp(0, _levelColors.length - 1);
  return _levelColors[i];
}

class MyLevelScreen extends ConsumerWidget {
  const MyLevelScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final levelsAsync = ref.watch(levelsProvider);
    final statsAsync = ref.watch(studentStatsProvider);

    final currentLevelId = statsAsync.valueOrNull?['currentLevelId'] as String? ?? '';

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                textDirection: TextDirection.rtl,
                children: [
                  Text(
                    'مستواي الحالي',
                    style: AppTextStyles.h3.copyWith(
                      color: const Color(0xFF373D41),
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: const Icon(Icons.arrow_forward_ios_rounded,
                        size: 20, color: Color(0xFF373D41)),
                  ),
                ],
              ),
            ),

            Expanded(
              child: levelsAsync.when(
                loading: () => const Center(
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
                error: (_, __) => const Center(child: Text('تعذّر التحميل')),
                data: (levels) => _buildList(context, levels, currentLevelId),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildList(
      BuildContext context, List<LevelModel> levels, String currentLevelId) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: levels.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final level = levels[index];
        final isCurrent = level.id == currentLevelId;
        final color = _colorForLevel(level.levelOrder);

        return _LevelRow(
          level: level,
          color: color,
          isCurrent: isCurrent,
        );
      },
    );
  }
}

class _LevelRow extends StatelessWidget {
  final LevelModel level;
  final Color color;
  final bool isCurrent;

  const _LevelRow({
    required this.level,
    required this.color,
    required this.isCurrent,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: isCurrent ? color.withOpacity(0.12) : const Color(0xFFFFF6EA),
        borderRadius: BorderRadius.circular(14),
        border: isCurrent
            ? Border.all(color: color, width: 2)
            : Border.all(color: Colors.transparent),
      ),
      child: Row(
        textDirection: TextDirection.rtl,
        children: [
          // Colored circle with level number
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                '${level.levelOrder}',
                style: const TextStyle(
                  fontFamily: 'Rubik',
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),

          // Title + current badge
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  level.title,
                  textAlign: TextAlign.right,
                  style: AppTextStyles.body.copyWith(
                    color: const Color(0xFF373D41),
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                if (isCurrent) ...[
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'مستواك الحالي',
                      style: TextStyle(
                        fontFamily: 'Rubik',
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Chevron
          const SizedBox(width: 8),
          Icon(Icons.chevron_left_rounded, color: color, size: 22),
        ],
      ),
    );
  }
}
