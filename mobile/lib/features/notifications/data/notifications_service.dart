import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/mock/mock_data.dart';
import '../../../models/notification_model.dart';

const _useMock = false;

class NotificationsService {
  final Dio _dio = apiClient;

  final List<NotificationModel> _local = List.from(mockNotifications);

  Future<List<NotificationModel>> getMyNotifications() async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 300),
        () => List.from(_local),
      );
    }
    try {
      final res = await _dio.get('/notifications');
      final list = res.data['data']['data'] as List? ?? [];
      return list
          .map((e) => NotificationModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> markAsRead(String id) async {
    if (_useMock) {
      final i = _local.indexWhere((n) => n.id == id);
      if (i != -1) {
        final n = _local[i];
        _local[i] = NotificationModel(
          id: n.id,
          type: n.type,
          message: n.message,
          link: n.link,
          read: true,
          createdAt: n.createdAt,
        );
      }
      return;
    }
    try {
      await _dio.patch('/notifications/$id', data: {'read': true});
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> markAllAsRead(List<String> ids) async {
    if (_useMock) {
      for (var i = 0; i < _local.length; i++) {
        final n = _local[i];
        _local[i] = NotificationModel(
          id: n.id, type: n.type, message: n.message,
          link: n.link, read: true, createdAt: n.createdAt,
        );
      }
      return;
    }
    await Future.wait(
      ids.map((id) => _dio.patch('/notifications/$id', data: {'read': true})),
    );
  }
}

final notificationsService = NotificationsService();
