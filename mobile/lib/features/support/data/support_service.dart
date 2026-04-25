import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../models/support_ticket_model.dart';

class SupportService {
  final Dio _dio = apiClient;

  Future<List<SupportTicketModel>> getMyTickets() async {
    try {
      final res = await _dio.get('/support/my-tickets');
      final list = res.data['data']['data'] as List? ?? [];
      return list
          .map((e) => SupportTicketModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<SupportTicketModel> createTicket({
    required String fullName,
    required String email,
    required String reason,
    required String message,
  }) async {
    try {
      final res = await _dio.post('/support', data: {
        'fullName': fullName,
        'email': email,
        'reason': reason,
        'message': message,
      });
      return SupportTicketModel.fromJson(
          res.data['data']['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}

final supportService = SupportService();
