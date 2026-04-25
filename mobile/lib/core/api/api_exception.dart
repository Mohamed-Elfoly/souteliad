import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  const ApiException(this.message, {this.statusCode});

  factory ApiException.fromDioException(DioException e) {
    final data = e.response?.data;
    String message = 'حدث خطأ، يرجى المحاولة مرة أخرى';

    if (data is Map && data['message'] != null) {
      message = data['message'].toString();
    } else if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      message = 'انتهت مهلة الاتصال، يرجى التحقق من الإنترنت';
    } else if (e.type == DioExceptionType.connectionError) {
      message = 'تعذر الاتصال بالخادم';
    }

    return ApiException(message, statusCode: e.response?.statusCode);
  }

  @override
  String toString() => message;
}
