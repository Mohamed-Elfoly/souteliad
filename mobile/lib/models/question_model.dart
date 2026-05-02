class QuestionOptionModel {
  final String id;
  final String text;
  final bool isCorrect;

  const QuestionOptionModel({
    required this.id,
    required this.text,
    required this.isCorrect,
  });

  factory QuestionOptionModel.fromJson(Map<String, dynamic> json) {
    return QuestionOptionModel(
      id: json['_id'] ?? json['id'] ?? '',
      text: json['text'] ?? '',
      isCorrect: json['isCorrect'] as bool? ?? false,
    );
  }
}

class QuestionModel {
  final String id;
  final String questionText;
  final String questionType; // 'mcq' | 'true-false' | 'ai-practice'
  final int marks;
  final List<QuestionOptionModel> options;
  final String? imageUrl;
  final String? expectedSign;
  final String? quizId;

  const QuestionModel({
    required this.id,
    required this.questionText,
    required this.questionType,
    required this.marks,
    required this.options,
    this.imageUrl,
    this.expectedSign,
    this.quizId,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) {
    final rawOptions = json['options'] as List? ?? [];
    return QuestionModel(
      id: json['_id'] ?? json['id'] ?? '',
      questionText: json['questionText'] ?? '',
      questionType: json['questionType'] ?? 'mcq',
      marks: json['marks'] as int? ?? 1,
      options: rawOptions
          .map((e) => QuestionOptionModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      imageUrl: json['imageUrl'],
      expectedSign: json['expectedSign'],
      quizId: json['quizId'] is String ? json['quizId'] : null,
    );
  }
}
