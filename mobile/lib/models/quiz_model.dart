import 'question_model.dart';

class QuizModel {
  final String id;
  final String title;
  final String lessonId;
  final List<QuestionModel> questions;

  const QuizModel({
    required this.id,
    required this.title,
    required this.lessonId,
    required this.questions,
  });

  int get totalMarks =>
      questions.fold(0, (sum, q) => sum + q.marks);

  factory QuizModel.fromJson(Map<String, dynamic> json) {
    final rawQuestions = json['questions'] as List? ?? [];
    return QuizModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      lessonId: json['lessonId'] is Map
          ? (json['lessonId']['_id'] ?? '')
          : (json['lessonId'] as String? ?? ''),
      questions: rawQuestions
          .map((e) => QuestionModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
