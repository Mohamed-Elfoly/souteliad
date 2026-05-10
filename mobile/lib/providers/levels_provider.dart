import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/level_model.dart';
import '../features/lessons/data/lessons_service.dart';

final levelsProvider = FutureProvider<List<LevelModel>>((ref) {
  return levelsService.getLevels();
});
