import 'lesson_model.dart';

class PostAuthor {
  final String id;
  final String firstName;
  final String lastName;
  final String? profilePicture;

  const PostAuthor({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.profilePicture,
  });

  String get fullName => '$firstName $lastName';
  String get initials =>
      firstName.isNotEmpty ? firstName[0] : '؟';

  factory PostAuthor.fromJson(Map<String, dynamic> json) {
    return PostAuthor(
      id: json['_id'] ?? json['id'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      profilePicture: LessonModel.resolveUrl(json['profilePicture']?.toString()),
    );
  }
}

class PostModel {
  final String id;
  final String content;
  final String? mediaUrl;
  final PostAuthor? author;
  final DateTime createdAt;
  final int likesCount;
  final int commentsCount;
  final bool isLiked;

  const PostModel({
    required this.id,
    required this.content,
    this.mediaUrl,
    this.author,
    required this.createdAt,
    this.likesCount = 0,
    this.commentsCount = 0,
    this.isLiked = false,
  });

  factory PostModel.fromJson(Map<String, dynamic> json, {String? currentUserId}) {
    final rawUser = json['userId'];
    PostAuthor? author;
    if (rawUser is Map<String, dynamic>) {
      author = PostAuthor.fromJson(rawUser);
    }

    final rawLikes = json['likes'];
    final int likesCount;
    final bool isLiked;
    if (rawLikes is List) {
      likesCount = rawLikes.length;
      isLiked = currentUserId != null &&
          rawLikes.any((id) => id.toString() == currentUserId);
    } else if (rawLikes is int) {
      likesCount = rawLikes;
      isLiked = false;
    } else {
      likesCount = 0;
      isLiked = false;
    }

    final rawComments = json['comments'];
    final int commentsCount;
    if (rawComments is List) {
      commentsCount = rawComments.length;
    } else if (rawComments is int) {
      commentsCount = rawComments;
    } else {
      commentsCount = 0;
    }

    return PostModel(
      id: json['_id'] ?? json['id'] ?? '',
      content: json['content'] ?? '',
      mediaUrl: json['mediaUrl'],
      author: author,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
      likesCount: likesCount,
      commentsCount: commentsCount,
      isLiked: isLiked,
    );
  }
}
