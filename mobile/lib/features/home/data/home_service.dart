import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/mock/mock_data.dart';

const _useMock = false;

class HomeService {
  final Dio _dio = apiClient;

  Future<Map<String, dynamic>> getStudentStats() async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 300),
        () => mockStudentStats,
      );
    }
    try {
      final res = await _dio.get('/stats/student');
      return res.data['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}

final homeService = HomeService();
