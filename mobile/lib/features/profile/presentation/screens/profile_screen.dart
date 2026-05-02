import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../models/user_model.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../providers/stats_provider.dart';
import '../../../../providers/levels_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  // Same color palette as MyLevelScreen
  static const _levelColors = [
    Color(0xFF6B2737),
    Color(0xFFB85C38),
    Color(0xFFE07B54),
    Color(0xFFE8A87C),
    Color(0xFFF2C4A0),
    Color(0xFFF7DFC0),
  ];

  static Color _colorForOrder(int order) {
    final i = (order - 1).clamp(0, _levelColors.length - 1);
    return _levelColors[i];
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;
    final statsAsync = ref.watch(studentStatsProvider);
    final levelsAsync = ref.watch(levelsProvider);

    // Resolve current level color
    final currentLevelId =
        statsAsync.valueOrNull?['currentLevelId'] as String? ?? '';
    final levels = levelsAsync.valueOrNull ?? [];
    final currentLevel = levels.isEmpty
        ? null
        : levels.where((l) => l.id == currentLevelId).firstOrNull;
    final levelColor = currentLevel != null
        ? _colorForOrder(currentLevel.levelOrder)
        : AppColors.primary;

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 24),
                child: Column(
                  children: [
                    _buildAvatarSection(context, user, levelColor),
                    const SizedBox(height: 32),
                    _buildMenuItems(context, ref),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Row(
          children: [
            Text(
              'حسابي',
              style: AppTextStyles.h3.copyWith(
                color: const Color(0xFF373D41),
                fontWeight: FontWeight.w700,
                fontSize: 20,
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.arrow_forward_ios_rounded,
                color: AppColors.primary, size: 18),
          ],
        ),
      ),
    );
  }

  Widget _buildAvatarSection(BuildContext context, UserModel? user, Color levelColor) {
    final avatarUrl = user?.profilePicture;

    return Column(
      children: [
        // Avatar with edit button
        Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              width: 136,
              height: 136,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: levelColor, width: 3.5),
              ),
              child: ClipOval(
                child: avatarUrl != null && avatarUrl.isNotEmpty
                    ? CachedNetworkImage(
                        imageUrl: avatarUrl,
                        fit: BoxFit.cover,
                        placeholder: (_, __) => _avatarPlaceholder(),
                        errorWidget: (_, __, ___) => _avatarPlaceholder(),
                      )
                    : _avatarPlaceholder(),
              ),
            ),
            // Edit badge
            Positioned(
              bottom: 0,
              right: 0,
              child: GestureDetector(
                onTap: () => context.push(AppRoutes.editProfile),
                child: Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.primary,
                    border: Border.all(color: AppColors.white, width: 2),
                  ),
                  child: const Icon(
                    Icons.edit_outlined,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        // Name
        Text(
          user?.fullName ?? 'المستخدم',
          style: AppTextStyles.h3.copyWith(
            color: const Color(0xFF373D41),
            fontWeight: FontWeight.w600,
            fontSize: 20,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        // Email
        Text(
          user?.email ?? '',
          style: AppTextStyles.body.copyWith(
            color: const Color(0xFF373D41),
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _avatarPlaceholder() {
    return Container(
      color: const Color(0xFFFFF0CF),
      child: const Center(
        child: Icon(Icons.person_rounded,
            size: 64, color: AppColors.primary),
      ),
    );
  }

  Widget _buildMenuItems(BuildContext context, WidgetRef ref) {
    return Column(
      children: [
        _MenuItem(
          label: 'تعديل الملف الشخصي',
          icon: Icons.edit_outlined,
          onTap: () => context.push(AppRoutes.editProfile),
        ),
        const SizedBox(height: 12),
        _MenuItem(
          label: 'تغيير كلمة المرور',
          icon: Icons.lock_outline,
          onTap: () => context.push(AppRoutes.changePassword),
        ),
        const SizedBox(height: 12),
        _MenuItem(
          label: 'درجاتي',
          icon: Icons.grade_outlined,
          onTap: () => context.push(AppRoutes.myGrades),
        ),
        const SizedBox(height: 12),
        _MenuItem(
          label: 'مستواي الحالي',
          icon: Icons.bar_chart_rounded,
          onTap: () => context.push(AppRoutes.myLevel),
        ),
        const SizedBox(height: 12),
        _MenuItem(
          label: 'الدعم',
          icon: Icons.help_outline_rounded,
          onTap: () => context.push(AppRoutes.support),
        ),
        const SizedBox(height: 12),
        _MenuItem(
          label: 'تسجيل الخروج',
          icon: Icons.logout_rounded,
          iconColor: const Color(0xFFE53935),
          labelColor: const Color(0xFFE53935),
          isDestructive: true,
          onTap: () => _confirmLogout(context, ref),
        ),
      ],
    );
  }

  void _confirmLogout(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Dialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          backgroundColor: Colors.white,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Red icon circle
                Container(
                  width: 64,
                  height: 64,
                  decoration: const BoxDecoration(
                    color: Color(0xFFE53935),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.logout_rounded,
                    color: Colors.white,
                    size: 32,
                  ),
                ),
                const SizedBox(height: 16),
                // Title
                const Text(
                  'تسجيل الخروج ؟',
                  style: TextStyle(
                    fontFamily: 'Rubik',
                    fontWeight: FontWeight.w700,
                    fontSize: 18,
                    color: Color(0xFF373D41),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                // Subtitle
                const Text(
                  'هل انت متأكد من تسجيل الخروج ؟',
                  style: TextStyle(
                    fontFamily: 'Rubik',
                    fontSize: 13,
                    color: Color(0xFF868687),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                // Buttons row
                Row(
                  children: [
                    // No — outlined, rightmost in RTL
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(ctx),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(
                              color: Color(0xFFE53935), width: 1.5),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 13),
                        ),
                        child: const Text(
                          'لا',
                          style: TextStyle(
                            fontFamily: 'Rubik',
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFE53935),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Yes — filled red, leftmost in RTL
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () async {
                          Navigator.pop(ctx);
                          await ref.read(authProvider.notifier).logout();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFE53935),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                        ),
                        child: const Text(
                          'نعم',
                          style: TextStyle(
                            fontFamily: 'Rubik',
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color iconColor;
  final Color? labelColor;
  final bool isDestructive;
  final VoidCallback onTap;

  const _MenuItem({
    required this.label,
    required this.icon,
    required this.onTap,
    this.iconColor = AppColors.primary,
    this.labelColor,
    this.isDestructive = false,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = isDestructive
        ? const Color(0xFFFFF0F0)
        : const Color(0xFFFFF2E7);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          // RTL: icon (right) → label (center) → chevron (left)
          textDirection: TextDirection.rtl,
          children: [
            // Leading icon — rightmost
            Icon(icon, color: iconColor, size: 22),
            const SizedBox(width: 12),
            // Label
            Expanded(
              child: Text(
                label,
                textAlign: TextAlign.right,
                style: AppTextStyles.body.copyWith(
                  color: labelColor ?? const Color(0xFF373D41),
                  fontWeight: FontWeight.w500,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Chevron — leftmost, points left = "forward in RTL"
            Icon(
              Icons.chevron_left_rounded,
              color: isDestructive
                  ? const Color(0xFFE53935)
                  : AppColors.primary,
              size: 22,
            ),
          ],
        ),
      ),
    );
  }
}
