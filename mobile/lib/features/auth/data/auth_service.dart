import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/mock/mock_data.dart';
import '../../../models/user_model.dart';

const _useMock = false;

class AuthService {
  final Dio _dio = apiClient;

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 600),
        () => {'token': 'mock-token-12345', 'user': mockUser},
      );
    }
    try {
      final res = await _dio.post('/users/login', data: {
        'email': email,
        'password': password,
      });
      final token = res.data['token'];
      final user = UserModel.fromJson(res.data['data']['user']);
      return {'token': token, 'user': user};
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<Map<String, dynamic>> signup({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String passwordConfirm,
  }) async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 600),
        () => {
          'token': 'mock-token-12345',
          'user': UserModel(
            id: 'user-mock-new',
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: 'student',
            profilePicture: null,
            active: true,
          ),
        },
      );
    }
    try {
      final res = await _dio.post('/users/signup', data: {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password,
        'passwordConfirm': passwordConfirm,
      });
      final token = res.data['token'];
      final user = UserModel.fromJson(res.data['data']['user']);
      return {'token': token, 'user': user};
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> forgotPassword(String email) async {
    if (_useMock) return Future.delayed(const Duration(milliseconds: 500));
    try {
      await _dio.post('/users/forgotPassword', data: {'email': email});
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> resetPassword({
    required String token,
    required String password,
    required String passwordConfirm,
  }) async {
    if (_useMock) return Future.delayed(const Duration(milliseconds: 500));
    try {
      await _dio.patch('/users/resetPassword/$token', data: {
        'password': password,
        'passwordConfirm': passwordConfirm,
      });
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> updatePassword({
    required String currentPassword,
    required String password,
    required String passwordConfirm,
  }) async {
    if (_useMock) return Future.delayed(const Duration(milliseconds: 500));
    try {
      await _dio.patch('/users/updateMyPassword', data: {
        'passwordCurrent': currentPassword,
        'password': password,
        'passwordConfirm': passwordConfirm,
      });
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}

final authService = AuthService();
