import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/mock/mock_data.dart';
import '../../../models/level_model.dart';
import '../../../models/lesson_model.dart';

const _useMock = false;

class LevelsService {
  final Dio _dio = apiClient;

  Future<List<LevelModel>> getLevels() async {
    if (_useMock) return Future.delayed(const Duration(milliseconds: 400), () => mockLevels);
    try {
      final res = await _dio.get('/levels/with-lessons');
      final list = res.data['data']['data'] as List;
      return list
          .map((e) => LevelModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<LevelModel> getLevel(String id) async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 300),
        () => mockLevels.firstWhere((l) => l.id == id, orElse: () => mockLevels.first),
      );
    }
    try {
      final res = await _dio.get('/levels/$id');
      return LevelModel.fromJson(res.data['data']['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<LessonModel> getLesson(String lessonId) async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 300),
        () => mockLessonsById[lessonId] ?? mockLessonsById.values.first,
      );
    }
    try {
      final res = await _dio.get('/lessons/$lessonId');
      return LessonModel.fromJson(res.data['data']['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> markLessonComplete(String lessonId) async {
    try {
      await _dio.post('/progress', data: {'lessonId': lessonId});
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<List<Map<String, dynamic>>> getMyProgress() async {
    try {
      final res = await _dio.get('/progress/my-progress');
      final list = res.data['data']['data'] as List? ?? [];
      return list.cast<Map<String, dynamic>>();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}

final levelsService = LevelsService();
