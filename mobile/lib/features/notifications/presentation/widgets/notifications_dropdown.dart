import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../models/notification_model.dart';
import '../../data/notifications_service.dart';
import '../../../../providers/notifications_provider.dart';
import '../screens/notifications_screen.dart' show notificationsListProvider;

class NotificationsBell extends ConsumerWidget {
  const NotificationsBell({super.key});

  void _showPanel(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ProviderScope(
        parent: ProviderScope.containerOf(context),
        child: _NotificationsPanel(onViewAll: () {
          Navigator.pop(context);
          context.go(AppRoutes.notifications);
        }),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final unreadCount = ref.watch(unreadCountProvider).valueOrNull ?? 0;

    return GestureDetector(
      onTap: () => _showPanel(context, ref),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.notifications_outlined,
                color: AppColors.primary, size: 22),
          ),
          if (unreadCount > 0)
            Positioned(
              top: -4,
              left: -4,
              child: Container(
                width: 18,
                height: 18,
                decoration: const BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    '$unreadCount',
                    style: const TextStyle(
                      fontFamily: 'Rubik',
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ── Bottom sheet panel ────────────────────────────────────────────────────────

class _NotificationsPanel extends ConsumerWidget {
  final VoidCallback onViewAll;
  const _NotificationsPanel({required this.onViewAll});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifAsync = ref.watch(notificationsListProvider);

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.6,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 4),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: const Color(0xFFDDDDDD),
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Directionality(
              textDirection: TextDirection.rtl,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: onViewAll,
                    child: const Text(
                      'عرض الكل',
                      style: TextStyle(
                        fontFamily: 'Rubik',
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                  const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.notifications_outlined,
                          size: 18, color: Color(0xFF373D41)),
                      SizedBox(width: 6),
                      Text(
                        'الإشعارات',
                        style: TextStyle(
                          fontFamily: 'Rubik',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF373D41),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const Divider(height: 1, color: Color(0xFFF0F0F0)),

          // Content
          Flexible(
            child: notifAsync.when(
              loading: () => const Padding(
                padding: EdgeInsets.all(32),
                child: Center(
                    child: CircularProgressIndicator(
                        color: AppColors.primary, strokeWidth: 2)),
              ),
              error: (_, __) => const Padding(
                padding: EdgeInsets.all(32),
                child: Center(
                    child: Text('تعذّر التحميل',
                        style: TextStyle(
                            fontFamily: 'Rubik',
                            color: Color(0xFF868687)))),
              ),
              data: (notifications) {
                if (notifications.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.all(40),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.notifications_none_outlined,
                              size: 48, color: Color(0xFFCCCCCC)),
                          SizedBox(height: 10),
                          Text(
                            'لا توجد إشعارات',
                            style: TextStyle(
                              fontFamily: 'Rubik',
                              fontSize: 14,
                              color: Color(0xFF868687),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }
                final latest = notifications.take(5).toList();
                return ListView.separated(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  shrinkWrap: true,
                  itemCount: latest.length,
                  separatorBuilder: (_, __) =>
                      const Divider(height: 1, color: Color(0xFFF5F5F5)),
                  itemBuilder: (context, i) {
                    final n = latest[i];
                    return _PanelItem(
                      notification: n,
                      onTap: () async {
                        if (!n.read) {
                          await notificationsService.markAsRead(n.id);
                          ref.invalidate(notificationsListProvider);
                          ref.invalidate(unreadCountProvider);
                        }
                        Navigator.pop(context);
                      },
                    );
                  },
                );
              },
            ),
          ),

          SizedBox(height: MediaQuery.of(context).padding.bottom + 8),
        ],
      ),
    );
  }
}

// ── Panel item ────────────────────────────────────────────────────────────────

class _PanelItem extends StatelessWidget {
  final NotificationModel notification;
  final VoidCallback onTap;
  const _PanelItem({required this.notification, required this.onTap});

  Color get _color {
    switch (notification.type) {
      case 'lesson': return const Color(0xFF4CAF50);
      case 'quiz': return const Color(0xFF2196F3);
      case 'community': return const Color(0xFF9C27B0);
      case 'announcement': return const Color(0xFFFF9800);
      case 'support': return const Color(0xFF00BCD4);
      default: return AppColors.primary;
    }
  }

  IconData get _icon {
    switch (notification.type) {
      case 'lesson': return Icons.play_circle_outline_rounded;
      case 'quiz': return Icons.quiz_outlined;
      case 'community': return Icons.forum_outlined;
      case 'announcement': return Icons.campaign_outlined;
      case 'support': return Icons.support_agent_outlined;
      default: return Icons.notifications_outlined;
    }
  }

  String get _title {
    switch (notification.type) {
      case 'lesson': return 'درس جديد';
      case 'quiz': return 'اختبار جديد';
      case 'community': return 'نشاط في المجتمع';
      case 'announcement': return 'إعلان';
      case 'support': return 'رد الدعم';
      default: return 'إشعار';
    }
  }

  String _formatTime() {
    final diff = DateTime.now().difference(notification.createdAt);
    if (diff.inMinutes < 1) return 'الآن';
    if (diff.inMinutes < 60) return 'منذ ${diff.inMinutes} د';
    if (diff.inHours < 24) return 'منذ ${diff.inHours} س';
    return 'منذ ${diff.inDays} يوم';
  }

  @override
  Widget build(BuildContext context) {
    final color = _color;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        color: notification.read ? Colors.transparent : color.withOpacity(0.04),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Directionality(
          textDirection: TextDirection.rtl,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(_icon, color: color, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(_formatTime(),
                            style: const TextStyle(
                                fontFamily: 'Rubik',
                                fontSize: 11,
                                color: Color(0xFFAAAAAA))),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (!notification.read)
                              Container(
                                width: 7, height: 7,
                                margin: const EdgeInsets.only(left: 5),
                                decoration: BoxDecoration(
                                    color: color, shape: BoxShape.circle),
                              ),
                            Text(_title,
                                style: TextStyle(
                                  fontFamily: 'Rubik',
                                  fontSize: 13,
                                  fontWeight: notification.read
                                      ? FontWeight.w500
                                      : FontWeight.w700,
                                  color: const Color(0xFF373D41),
                                )),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notification.message,
                      textAlign: TextAlign.right,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontFamily: 'Rubik',
                        fontSize: 12,
                        color: Color(0xFF868687),
                        height: 1.4,
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
