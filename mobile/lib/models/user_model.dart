import 'lesson_model.dart';

class UserModel {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String role;
  final String? profilePicture;
  final bool active;

  const UserModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.role,
    this.profilePicture,
    required this.active,
  });

  String get fullName => '$firstName $lastName';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'user',
      profilePicture: LessonModel.resolveUrl(json['profilePicture']?.toString()),
      active: json['active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'role': role,
        'profilePicture': profilePicture,
        'active': active,
      };
}
