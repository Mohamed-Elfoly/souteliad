import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../models/level_model.dart';
import '../../../../providers/levels_provider.dart';

class ExploreScreen extends ConsumerWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final levelsAsync = ref.watch(levelsProvider);

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            const SizedBox(height: 16),

            Center(
              child: Text(
                'الدروس',
                style: AppTextStyles.h2.copyWith(
                  color: const Color(0xFF373D41),
                ),
              ),
            ),

            const SizedBox(height: 12),

            Expanded(
              child: levelsAsync.when(
                loading: () => const _LevelsLoadingList(),
                error: (e, _) => Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.wifi_off_outlined,
                          size: 48, color: AppColors.border),
                      const SizedBox(height: 12),
                      Text(
                        'تعذّر تحميل الدروس',
                        style: AppTextStyles.body.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextButton(
                        onPressed: () => ref.refresh(levelsProvider),
                        child: const Text('إعادة المحاولة'),
                      ),
                    ],
                  ),
                ),
                data: (levels) {
                  if (levels.isEmpty) {
                    return Center(
                      child: Text(
                        'لا توجد دروس متاحة حالياً',
                        style: AppTextStyles.body.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    );
                  }
                  return ListView.separated(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 4),
                    itemCount: levels.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, i) =>
                        _LevelCard(level: levels[i]),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),
          ],
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

class _LevelCard extends StatelessWidget {
  final LevelModel level;
  const _LevelCard({required this.level});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/level/${level.id}'),
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          color: const Color(0xFFFFF6EA),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          textDirection: TextDirection.rtl,
          children: [
            // Level badge — rightmost
            Container(
              width: 110,
              height: double.infinity,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFFEB6837), Color(0xFF632C17)],
                ),
                borderRadius: const BorderRadius.only(
                  topRight: Radius.circular(12),
                  bottomRight: Radius.circular(12),
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '${level.levelOrder}',
                    style: const TextStyle(
                      fontFamily: 'Rubik',
                      fontSize: 32,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const Text(
                    'مستوى',
                    style: TextStyle(
                      fontFamily: 'Rubik',
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 14, vertical: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      level.title,
                      textAlign: TextAlign.right,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: const Color(0xFF373D41),
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),

                    if (level.description != null &&
                        level.description!.isNotEmpty)
                      Text(
                        level.description!,
                        textAlign: TextAlign.right,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyles.small.copyWith(
                          color: const Color(0xFF666667),
                          fontSize: 12,
                        ),
                      ),

                    Row(
                      textDirection: TextDirection.rtl,
                      children: [
                        _MetaChip(
                          icon: Icons.layers_outlined,
                          label: 'المستوى ${level.levelOrder}',
                        ),
                        const SizedBox(width: 10),
                        const _MetaChip(
                          icon: Icons.play_circle_outline,
                          label: 'دروس',
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const Padding(
              padding: EdgeInsets.only(right: 10),
              child: Icon(
                Icons.arrow_back_ios_new_rounded,
                size: 16,
                color: Color(0xFFEB6837),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetaChip extends StatelessWidget {
  final IconData icon;
  final String label;
  const _MetaChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      textDirection: TextDirection.rtl,
      children: [
        Icon(icon, size: 14, color: const Color(0xFFEB6837)),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            fontFamily: 'Rubik',
            fontSize: 11,
            color: Color(0xFF888888),
          ),
        ),
      ],
    );
  }
}

class _LevelsLoadingList extends StatelessWidget {
  const _LevelsLoadingList();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      itemCount: 5,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, __) => Container(
        height: 120,
        decoration: BoxDecoration(
          color: AppColors.shimmer,
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
