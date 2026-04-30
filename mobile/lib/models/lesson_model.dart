import '../core/constants/app_constants.dart';

class LessonModel {
  final String id;
  final String title;
  final String? description;
  final String videoUrl;
  final String? thumbnailUrl;
  final String duration;
  final double avgRating;
  final int numRatings;
  final int lessonOrder;
  final String levelId;
  final String? levelTitle;

  const LessonModel({
    required this.id,
    required this.title,
    this.description,
    required this.videoUrl,
    this.thumbnailUrl,
    required this.duration,
    required this.avgRating,
    required this.numRatings,
    required this.lessonOrder,
    required this.levelId,
    this.levelTitle,
  });

  static String? resolveUrl(String? url) {
    if (url == null || url.isEmpty) return null;
    var resolved = url;
    // Convert relative path to absolute
    if (!resolved.startsWith('http://') && !resolved.startsWith('https://')) {
      final base = AppConstants.baseUrl.replaceFirst(RegExp(r'/api/v1$'), '');
      resolved = '$base$resolved';
    }
    // Fix localhost for Android emulator
    resolved = resolved
        .replaceAll('http://localhost:', 'http://192.168.1.6:')
        .replaceAll('http://127.0.0.1:', 'http://192.168.1.6:')
        .replaceAll('http://10.0.2.2:', 'http://192.168.1.6:');
    return resolved;
  }

  factory LessonModel.fromJson(Map<String, dynamic> json) {
    // levelId may be a plain String id or a populated object
    final rawLevel = json['levelId'];
    final String lid;
    String? ltitle;
    if (rawLevel is Map<String, dynamic>) {
      lid = rawLevel['_id'] ?? '';
      ltitle = rawLevel['title'];
    } else {
      lid = rawLevel as String? ?? '';
    }

    return LessonModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      videoUrl: resolveUrl(json['videoUrl']?.toString()) ?? '',
      thumbnailUrl: resolveUrl(json['thumbnailUrl']?.toString()),
      duration: json['duration'] ?? '0:00',
      avgRating: (json['avgRating'] as num? ?? 0).toDouble(),
      numRatings: json['numRatings'] as int? ?? 0,
      lessonOrder: json['lessonOrder'] as int? ?? 0,
      levelId: lid,
      levelTitle: ltitle,
    );
  }
}
