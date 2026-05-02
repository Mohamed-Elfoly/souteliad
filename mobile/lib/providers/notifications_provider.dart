import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/api/api_client.dart';

final unreadCountProvider = FutureProvider<int>((ref) async {
  try {
    final res = await apiClient.get('/notifications/unread-count');
    return (res.data['data']['unreadCount'] as num?)?.toInt() ?? 0;
  } catch (_) {
    return 0;
  }
});
