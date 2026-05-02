class NotificationModel {
  final String id;
  final String type; // 'lesson' | 'quiz' | 'community' | 'system' | 'announcement'
  final String message;
  final String? link;
  final bool read;
  final DateTime createdAt;

  const NotificationModel({
    required this.id,
    required this.type,
    required this.message,
    this.link,
    required this.read,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['_id'] ?? json['id'] ?? '',
      type: json['type'] ?? 'system',
      message: json['message'] ?? '',
      link: json['link'],
      read: json['read'] as bool? ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
