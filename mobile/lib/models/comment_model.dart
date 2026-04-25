import 'lesson_model.dart';

class CommentAuthor {
  final String id;
  final String firstName;
  final String lastName;
  final String? profilePicture;

  const CommentAuthor({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.profilePicture,
  });

  String get fullName => '$firstName $lastName';
  String get initials => firstName.isNotEmpty ? firstName[0] : '؟';

  factory CommentAuthor.fromJson(Map<String, dynamic> json) {
    return CommentAuthor(
      id: json['_id'] ?? json['id'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      profilePicture: LessonModel.resolveUrl(json['profilePicture']?.toString()),
    );
  }
}

class CommentModel {
  final String id;
  final String content;
  final CommentAuthor? author;
  final String postId;
  final DateTime createdAt;

  const CommentModel({
    required this.id,
    required this.content,
    this.author,
    required this.postId,
    required this.createdAt,
  });

  factory CommentModel.fromJson(Map<String, dynamic> json) {
    final rawUser = json['userId'];
    CommentAuthor? author;
    if (rawUser is Map<String, dynamic>) {
      author = CommentAuthor.fromJson(rawUser);
    }

    return CommentModel(
      id: json['_id'] ?? json['id'] ?? '',
      content: json['content'] ?? '',
      author: author,
      postId: json['postId']?.toString() ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
