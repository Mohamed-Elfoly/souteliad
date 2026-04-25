import 'lesson_model.dart';

class LevelModel {
  final String id;
  final String title;
  final String? description;
  final int levelOrder;
  final List<LessonModel> lessons;

  const LevelModel({
    required this.id,
    required this.title,
    this.description,
    required this.levelOrder,
    this.lessons = const [],
  });

  factory LevelModel.fromJson(Map<String, dynamic> json) {
    final rawLessons = json['lessons'] as List? ?? [];
    return LevelModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      levelOrder: json['levelOrder'] ?? 0,
      lessons: rawLessons
          .map((e) => LessonModel.fromJson(e as Map<String, dynamic>))
          .toList()
        ..sort((a, b) => a.lessonOrder.compareTo(b.lessonOrder)),
    );
  }
}
