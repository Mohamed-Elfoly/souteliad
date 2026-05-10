import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/mock/mock_data.dart';
import '../../../models/post_model.dart';
import '../../../models/comment_model.dart';

const _useMock = false;

class CommunityService {
  final Dio _dio = apiClient;

  final List<PostModel> _localPosts = List.from(mockPosts);

  Future<List<PostModel>> getPosts() async {
    if (_useMock) {
      return Future.delayed(
        const Duration(milliseconds: 400),
        () => List.from(_localPosts),
      );
    }
    try {
      final res = await _dio.get('/posts');
      final list = res.data['data']['data'] as List? ?? [];
      return list
          .map((e) => PostModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<PostModel> createPost(String content) async {
    if (_useMock) {
      final newPost = PostModel(
        id: 'post-${DateTime.now().millisecondsSinceEpoch}',
        content: content,
        author: const PostAuthor(
            id: 'user-mock-1', firstName: 'أحمد', lastName: 'علي'),
        createdAt: DateTime.now(),
        likesCount: 0,
      );
      _localPosts.insert(0, newPost);
      return Future.delayed(const Duration(milliseconds: 300), () => newPost);
    }
    try {
      final res = await _dio.post('/posts', data: {'content': content});
      return PostModel.fromJson(
          res.data['data']['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> deletePost(String postId) async {
    if (_useMock) {
      _localPosts.removeWhere((p) => p.id == postId);
      return Future.delayed(const Duration(milliseconds: 200));
    }
    try {
      await _dio.delete('/posts/$postId');
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> toggleLike(String postId) async {
    if (_useMock) return Future.delayed(const Duration(milliseconds: 200));
    try {
      await _dio.post('/posts/$postId/likes');
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<List<CommentModel>> getComments(String postId) async {
    if (_useMock) {
      return Future.delayed(const Duration(milliseconds: 300), () => []);
    }
    try {
      final res = await _dio.get('/posts/$postId/comments');
      final rawData = res.data['data'];
      final list = (rawData is Map ? rawData['data'] : rawData) as List? ?? [];
      return list
          .map((e) => CommentModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<CommentModel> createComment(String postId, String content) async {
    if (_useMock) {
      return Future.delayed(const Duration(milliseconds: 300), () {
        return CommentModel(
          id: 'comment-${DateTime.now().millisecondsSinceEpoch}',
          content: content,
          postId: postId,
          createdAt: DateTime.now(),
        );
      });
    }
    try {
      final res = await _dio.post(
        '/posts/$postId/comments',
        data: {'content': content},
      );
      return CommentModel.fromJson(
          res.data['data']['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> deleteComment(String postId, String commentId) async {
    if (_useMock) return Future.delayed(const Duration(milliseconds: 200));
    try {
      await _dio.delete('/posts/$postId/comments/$commentId');
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}

final communityService = CommunityService();
