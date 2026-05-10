import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';

class RatingModel {
  final String id;
  final String lessonId;
  final String userId;
  final int rating;
  final DateTime createdAt;

  const RatingModel({
    required this.id,
    required this.lessonId,
    required this.userId,
    required this.rating,
    required this.createdAt,
  });

  factory RatingModel.fromJson(Map<String, dynamic> json) {
    return RatingModel(
      id: json['_id'] ?? json['id'] ?? '',
      lessonId: json['lessonId'] is Map
          ? (json['lessonId']['_id'] ?? '')
          : (json['lessonId'] ?? ''),
      userId: json['userId'] is Map
          ? (json['userId']['_id'] ?? '')
          : (json['userId'] ?? ''),
      rating: (json['rating'] as num?)?.toInt() ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
    );
  }
}

class RatingsService {
  final Dio _dio = apiClient;

  // POST /lessons/:lessonId/ratings — rate 1–5
  Future<void> addRating(String lessonId, int rating) async {
    try {
      await _dio.post('/lessons/$lessonId/ratings', data: {'rating': rating});
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  // GET /lessons/:lessonId/ratings/me — returns null if not rated yet
  Future<RatingModel?> getMyRating(String lessonId) async {
    try {
      final res = await _dio.get('/lessons/$lessonId/ratings/me');
      final data = res.data['data']['data'];
      if (data == null) return null;
      return RatingModel.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) return null;
      throw ApiException.fromDioException(e);
    }
  }
}

final ratingsService = RatingsService();
