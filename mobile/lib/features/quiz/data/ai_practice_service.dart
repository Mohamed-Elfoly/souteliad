import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';

class AIPracticeResult {
  final String id;
  final String questionId;
  final double accuracy;
  final bool passed;
  final String? feedback;
  final DateTime createdAt;

  const AIPracticeResult({
    required this.id,
    required this.questionId,
    required this.accuracy,
    required this.passed,
    this.feedback,
    required this.createdAt,
  });

  factory AIPracticeResult.fromJson(Map<String, dynamic> json) {
    return AIPracticeResult(
      id: json['_id'] ?? json['id'] ?? '',
      questionId: json['questionId'] is Map
          ? (json['questionId']['_id'] ?? '')
          : (json['questionId'] ?? ''),
      accuracy: (json['accuracy'] as num?)?.toDouble() ?? 0.0,
      passed: json['passed'] as bool? ?? false,
      feedback: json['feedback'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
    );
  }
}

class AIPracticeService {
  final Dio _dio = apiClient;

  // POST /ai-practice/:questionId — upload video, get AI feedback
  Future<AIPracticeResult> evaluateSign(
      String questionId, String videoPath) async {
    try {
      final formData = FormData.fromMap({
        'video': await MultipartFile.fromFile(
          videoPath,
          filename: videoPath.split('/').last,
        ),
      });
      final res = await _dio.post(
        '/ai-practice/$questionId',
        data: formData,
        options: Options(
          headers: {'Content-Type': 'multipart/form-data'},
          sendTimeout: const Duration(seconds: 60),
          receiveTimeout: const Duration(seconds: 60),
        ),
      );
      return AIPracticeResult.fromJson(
          res.data['data']['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  // GET /ai-practice/:questionId/my-results
  Future<List<AIPracticeResult>> getMyResults(String questionId) async {
    try {
      final res = await _dio.get('/ai-practice/$questionId/my-results');
      final list = res.data['data']['data'] as List? ?? [];
      return list
          .map((e) => AIPracticeResult.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}

final aiPracticeService = AIPracticeService();
