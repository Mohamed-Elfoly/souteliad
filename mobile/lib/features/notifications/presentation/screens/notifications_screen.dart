import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../models/notification_model.dart';
import '../../data/notifications_service.dart';
import '../../../../providers/notifications_provider.dart';

final notificationsListProvider =
    FutureProvider<List<NotificationModel>>((ref) async {
  return notificationsService.getMyNotifications();
});

enum _Filter { all, unread, read }

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  _Filter _filter = _Filter.all;

  @override
  Widget build(BuildContext context) {
    final notifAsync = ref.watch(notificationsListProvider);

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            // ── Header ──────────────────────────────────────────────────
            notifAsync.when(
              loading: () => _buildHeader(ref, null),
              error: (_, __) => _buildHeader(ref, null),
              data: (n) => _buildHeader(ref, n),
            ),

            // ── Filter tabs ─────────────────────────────────────────────
            _buildFilterTabs(),

            // ── Content ─────────────────────────────────────────────────
            Expanded(
              child: notifAsync.when(
                loading: () => const Center(
                  child:
                      CircularProgressIndicator(color: AppColors.primary),
                ),
                error: (err, _) => _buildError(ref),
                data: (notifications) {
                  final filtered = _applyFilter(notifications);
                  return filtered.isEmpty
                      ? _buildEmpty()
                      : _buildList(context, ref, filtered);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<NotificationModel> _applyFilter(List<NotificationModel> all) {
    if (_filter == _Filter.unread) return all.where((n) => !n.read).toList();
    if (_filter == _Filter.read) return all.where((n) => n.read).toList();
    return all;
  }

  Widget _buildHeader(WidgetRef ref, List<NotificationModel>? notifications) {
    final unread = notifications?.where((n) => !n.read).toList() ?? [];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'الإشعارات',
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
            if (unread.isNotEmpty)
              GestureDetector(
                onTap: () async {
                  await notificationsService
                      .markAllAsRead(unread.map((n) => n.id).toList());
                  ref.invalidate(notificationsListProvider);
                  ref.invalidate(unreadCountProvider);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.done_all_rounded,
                          color: AppColors.primary, size: 16),
                      SizedBox(width: 4),
                      Text(
                        'قراءة الكل',
                        style: TextStyle(
                          fontFamily: 'Rubik',
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
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

  Widget _buildFilterTabs() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Row(
          children: [
            _FilterChip(
              label: 'الكل',
              icon: Icons.notifications_outlined,
              selected: _filter == _Filter.all,
              onTap: () => setState(() => _filter = _Filter.all),
            ),
            const SizedBox(width: 8),
            _FilterChip(
              label: 'غير مقروءة',
              icon: Icons.mark_email_unread_outlined,
              selected: _filter == _Filter.unread,
              onTap: () => setState(() => _filter = _Filter.unread),
            ),
            const SizedBox(width: 8),
            _FilterChip(
              label: 'مقروءة',
              icon: Icons.done_all_rounded,
              selected: _filter == _Filter.read,
              onTap: () => setState(() => _filter = _Filter.read),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildError(WidgetRef ref) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.wifi_off_outlined,
              size: 48, color: AppColors.border),
          const SizedBox(height: 12),
          Text('تعذّر تحميل الإشعارات',
              style: AppTextStyles.body
                  .copyWith(color: AppColors.textSecondary)),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () => ref.invalidate(notificationsListProvider),
            child: const Text('إعادة المحاولة',
                style: TextStyle(color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.notifications_none_outlined,
              size: 64, color: AppColors.textHint),
          const SizedBox(height: 16),
          Text(
            'لا توجد إشعارات',
            style: AppTextStyles.body
                .copyWith(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildList(BuildContext context, WidgetRef ref,
      List<NotificationModel> notifications) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));

    final Map<String, List<NotificationModel>> groups = {};
    for (final n in notifications) {
      final d =
          DateTime(n.createdAt.year, n.createdAt.month, n.createdAt.day);
      String label;
      if (d == today) {
        label = 'اليوم';
      } else if (d == yesterday) {
        label = 'أمس';
      } else {
        label =
            '${d.day} ${_monthName(d.month)} ${d.year}';
      }
      groups.putIfAbsent(label, () => []).add(n);
    }

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      children: [
        for (final entry in groups.entries) ...[
          _buildGroupLabel(entry.key),
          const SizedBox(height: 10),
          for (final notif in entry.value)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _NotificationCard(
                notification: notif,
                onTap: () async {
                  if (!notif.read) {
                    await notificationsService.markAsRead(notif.id);
                    ref.invalidate(notificationsListProvider);
                    ref.invalidate(unreadCountProvider);
                  }
                },
              ),
            ),
          const SizedBox(height: 4),
        ],
      ],
    );
  }

  Widget _buildGroupLabel(String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        textDirection: TextDirection.rtl,
        children: [
          const Icon(Icons.calendar_today_outlined,
              size: 14, color: AppColors.textSecondary),
          const SizedBox(width: 6),
          Text(
            label,
            style: AppTextStyles.small.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  String _monthName(int m) {
    const months = [
      '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[m];
  }
}

// ── Filter chip ───────────────────────────────────────────────────────────────

class _FilterChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : const Color(0xFFF5F5F5),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon,
                size: 14,
                color: selected ? Colors.white : AppColors.textSecondary),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                fontFamily: 'Rubik',
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: selected ? Colors.white : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Notification card ─────────────────────────────────────────────────────────

class _NotificationCard extends StatelessWidget {
  final NotificationModel notification;
  final VoidCallback onTap;

  const _NotificationCard({
    required this.notification,
    required this.onTap,
  });

  IconData get _typeIcon {
    switch (notification.type) {
      case 'lesson':
        return Icons.play_circle_outline_rounded;
      case 'quiz':
        return Icons.quiz_outlined;
      case 'community':
        return Icons.forum_outlined;
      case 'announcement':
        return Icons.campaign_outlined;
      case 'support':
        return Icons.support_agent_outlined;
      case 'system':
        return Icons.info_outline_rounded;
      default:
        return Icons.notifications_outlined;
    }
  }

  Color get _typeColor {
    switch (notification.type) {
      case 'lesson':
        return const Color(0xFF4CAF50);
      case 'quiz':
        return const Color(0xFF2196F3);
      case 'community':
        return const Color(0xFF9C27B0);
      case 'announcement':
        return const Color(0xFFFF9800);
      case 'support':
        return const Color(0xFF00BCD4);
      case 'system':
        return const Color(0xFF607D8B);
      default:
        return AppColors.primary;
    }
  }

  String get _typeTitle {
    switch (notification.type) {
      case 'lesson':
        return 'درس جديد';
      case 'quiz':
        return 'اختبار جديد';
      case 'community':
        return 'نشاط في المجتمع';
      case 'announcement':
        return 'إعلان';
      case 'support':
        return 'رد الدعم';
      case 'system':
        return 'إشعار النظام';
      default:
        return 'إشعار';
    }
  }

  String _formatTime() {
    final now = DateTime.now();
    final diff = now.difference(notification.createdAt);
    if (diff.inMinutes < 1) return 'الآن';
    if (diff.inMinutes < 60) return 'منذ ${diff.inMinutes} د';
    if (diff.inHours < 24) return 'منذ ${diff.inHours} س';
    if (diff.inDays < 7) return 'منذ ${diff.inDays} يوم';
    final h = notification.createdAt.hour.toString().padLeft(2, '0');
    final m = notification.createdAt.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  @override
  Widget build(BuildContext context) {
    final color = _typeColor;
    final bgColor = notification.read
        ? const Color(0xFFF9F9F9)
        : color.withOpacity(0.07);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
          border: notification.read
              ? Border.all(color: const Color(0xFFEEEEEE))
              : Border.all(color: color.withOpacity(0.3), width: 1.5),
        ),
        child: Directionality(
          textDirection: TextDirection.rtl,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(_typeIcon, color: color, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _formatTime(),
                          style: TextStyle(
                            fontFamily: 'Rubik',
                            fontSize: 11,
                            color: Colors.grey[500],
                          ),
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (!notification.read)
                              Container(
                                width: 8,
                                height: 8,
                                margin: const EdgeInsets.only(left: 6),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: color,
                                ),
                              ),
                            Text(
                              _typeTitle,
                              style: AppTextStyles.body.copyWith(
                                color: const Color(0xFF373D41),
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    Text(
                      notification.message,
                      textAlign: TextAlign.right,
                      style: AppTextStyles.small.copyWith(
                        color: const Color(0xFF666667),
                        fontSize: 13,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
