import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../features/home/data/home_service.dart';

final studentStatsProvider = FutureProvider<Map<String, dynamic>>((ref) {
  return homeService.getStudentStats();
});
