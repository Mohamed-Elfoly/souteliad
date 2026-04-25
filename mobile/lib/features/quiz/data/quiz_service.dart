import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/mock/mock_data.dart';
import '../../../models/quiz_model.dart';

const _useMock = false;

class QuizSubmitResult {
  final int score;
  final int totalMarks;
  final bool passed;

  const QuizSubmitResult({
    required this.score,
    required this.totalMarks,
    required this.passed,
  });
}

class QuizService {
  final Dio _dio = apiClient;

  Future<QuizModel> getQuiz(String quizId) async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 300),
        () => mockQuizzes.values.firstWhere(
          (q) => q.id == quizId,
          orElse: () => mockQuizzes.values.first,
        ),
      );
    }
    try {
      final res = await _dio.get('/quizzes/$quizId');
      return QuizModel.fromJson(res.data['data']['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<QuizModel?> getQuizByLesson(String lessonId) async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 200),
        () => mockQuizzes[lessonId],
      );
    }
    try {
      final res = await _dio.get('/lessons/$lessonId/quizzes');
      final list = res.data['data']['data'] as List? ?? [];
      if (list.isEmpty) return null;
      return QuizModel.fromJson(list.first as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<QuizSubmitResult> submitQuiz({
    required String quizId,
    required List<Map<String, String>> answers,
  }) async {
    if (_useMock) {
      final quiz = mockQuizzes.values.firstWhere(
        (q) => q.id == quizId,
        orElse: () => mockQuizzes.values.first,
      );
      return Future.delayed(
        const Duration(milliseconds: 600),
        () => mockSubmitQuiz(answers, quiz),
      );
    }
    try {
      final res = await _dio.post('/quiz-attempts', data: {
        'quizId': quizId,
        'answers': answers,
      });
      final data = res.data['data']['data'] as Map<String, dynamic>;
      return QuizSubmitResult(
        score: data['score'] as int? ?? 0,
        totalMarks: data['totalMarks'] as int? ?? 0,
        passed: data['passed'] as bool? ?? false,
      );
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}

final quizService = QuizService();
