import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/mock/mock_data.dart';
import '../../../models/user_model.dart';

const _useMock = false;

class QuizAttemptSummary {
  final String id;
  final String quizTitle;
  final int score;
  final int totalMarks;
  final bool passed;
  final DateTime createdAt;

  const QuizAttemptSummary({
    required this.id,
    required this.quizTitle,
    required this.score,
    required this.totalMarks,
    required this.passed,
    required this.createdAt,
  });

  int get percentage =>
      totalMarks == 0 ? 0 : ((score / totalMarks) * 100).round();

  factory QuizAttemptSummary.fromJson(Map<String, dynamic> json) {
    final quiz = json['quizId'] as Map<String, dynamic>? ?? {};
    return QuizAttemptSummary(
      id: json['_id'] as String? ?? '',
      quizTitle: quiz['title'] as String? ?? 'اختبار',
      score: (json['score'] as num?)?.toInt() ?? 0,
      totalMarks: (json['totalMarks'] as num?)?.toInt() ?? 0,
      passed: json['passed'] as bool? ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
    );
  }
}

class UserService {
  final Dio _dio = apiClient;

  // GET /users/me — fetch current user profile
  Future<UserModel> getMe() async {
    try {
      final res = await _dio.get('/users/me');
      return UserModel.fromJson(res.data['data']['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<UserModel> updateMeWithPhoto({
    required String firstName,
    required String lastName,
    required String email,
    required String photoPath,
  }) async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 600),
        () => UserModel(
          id: mockUser.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: mockUser.role,
          profilePicture: null,
          active: true,
        ),
      );
    }
    try {
      final formData = FormData.fromMap({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'profilePicture': await MultipartFile.fromFile(
          photoPath,
          filename: photoPath.split('/').last,
        ),
      });
      final res = await _dio.patch('/users/updateMe', data: formData);
      return UserModel.fromJson(
          res.data['data']['user'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<UserModel> updateMe({
    required String firstName,
    required String lastName,
    required String email,
  }) async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 400),
        () => UserModel(
          id: mockUser.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: mockUser.role,
          profilePicture: mockUser.profilePicture,
          active: true,
        ),
      );
    }
    try {
      final res = await _dio.patch('/users/updateMe', data: {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
      });
      return UserModel.fromJson(res.data['data']['user'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> updatePassword({
    required String currentPassword,
    required String newPassword,
    required String confirmPassword,
  }) async {
    if (_useMock) {
      return Future.delayed(const Duration(milliseconds: 400));
    }
    try {
      await _dio.patch('/users/updateMyPassword', data: {
        'passwordCurrent': currentPassword,
        'password': newPassword,
        'passwordConfirm': confirmPassword,
      });
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<List<QuizAttemptSummary>> getMyAttempts() async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 400),
        () => mockAttempts,
      );
    }
    try {
      final res = await _dio.get('/quiz-attempts/my-attempts');
      final list = res.data['data']['data'] as List? ?? [];
      return list
          .map((e) => QuizAttemptSummary.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}

final userService = UserService();
