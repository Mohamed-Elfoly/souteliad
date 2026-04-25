import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../models/post_model.dart';
import '../../../../models/comment_model.dart';
import '../../../../providers/auth_provider.dart';
import '../../data/community_service.dart';

final _postsProvider = FutureProvider<List<PostModel>>((ref) async {
  return communityService.getPosts();
});

class CommunityScreen extends ConsumerWidget {
  const CommunityScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsAsync = ref.watch(_postsProvider);

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context, ref),
            Expanded(
              child: postsAsync.when(
                loading: () => const Center(
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
                error: (err, _) => _buildError(ref, err.toString()),
                data: (posts) => posts.isEmpty
                    ? _buildEmpty(context, ref)
                    : _buildPostsList(context, ref, posts),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Directionality(
        textDirection: TextDirection.ltr,
        child: Row(
          children: [
            // Add post button — always on the left
            GestureDetector(
              onTap: () => _showNewPostSheet(context, ref),
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF0CF),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.add_comment_outlined,
                    color: AppColors.primary, size: 20),
              ),
            ),
            // Title centered
            Expanded(
              child: Text(
                'المجتمع',
                textAlign: TextAlign.center,
                style: AppTextStyles.h3.copyWith(
                  color: const Color(0xFF373D41),
                  fontWeight: FontWeight.w700,
                  fontSize: 20,
                ),
              ),
            ),
            // Spacer to balance add button
            const SizedBox(width: 36),
          ],
        ),
      ),
    );
  }

  Widget _buildError(WidgetRef ref, String message) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.wifi_off_outlined, size: 48, color: AppColors.border),
          const SizedBox(height: 12),
          Text('تعذّر تحميل المنشورات',
              style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () => ref.invalidate(_postsProvider),
            child: const Text('إعادة المحاولة',
                style: TextStyle(color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  Widget _buildEmpty(BuildContext context, WidgetRef ref) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.forum_outlined, size: 64, color: AppColors.textHint),
          const SizedBox(height: 16),
          Text('لا توجد منشورات بعد',
              style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () => _showNewPostSheet(context, ref),
            icon: const Icon(Icons.add, color: Colors.white, size: 18),
            label: const Text('أضف أول منشور',
                style: TextStyle(
                    fontFamily: 'Rubik',
                    fontWeight: FontWeight.w600,
                    color: Colors.white)),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20)),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPostsList(
      BuildContext context, WidgetRef ref, List<PostModel> posts) {
    final currentUserId = ref.read(authProvider).user?.id;
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: posts.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (_, i) => _PostCard(
        post: posts[i],
        currentUserId: currentUserId ?? '',
        onLike: () async {
          await communityService.toggleLike(posts[i].id);
          ref.invalidate(_postsProvider);
        },
        onDelete: () async {
          await communityService.deletePost(posts[i].id);
          ref.invalidate(_postsProvider);
        },
        onComment: () => _showCommentsSheet(context, ref, posts[i]),
      ),
    );
  }

  void _showNewPostSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) =>
          _NewPostSheet(onPosted: () => ref.invalidate(_postsProvider)),
    );
  }

  void _showCommentsSheet(
      BuildContext context, WidgetRef ref, PostModel post) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _CommentsSheet(
        post: post,
        currentUserId: ref.read(authProvider).user?.id ?? '',
      ),
    ).then((_) => ref.invalidate(_postsProvider));
  }
}

// ── Post card ─────────────────────────────────────────────────────────────────

class _PostCard extends StatelessWidget {
  final PostModel post;
  final String currentUserId;
  final VoidCallback onLike;
  final VoidCallback onDelete;
  final VoidCallback onComment;

  const _PostCard({
    required this.post,
    required this.currentUserId,
    required this.onLike,
    required this.onDelete,
    required this.onComment,
  });

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final d = DateTime(date.year, date.month, date.day);
    if (d == today) return 'اليوم';
    if (d == yesterday) return 'أمس';
    return '${date.day}/${date.month}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final author = post.author;
    final initials = author?.initials ?? '؟';
    final isOwner = author?.id == currentUserId;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF6EA),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        textDirection: TextDirection.rtl,
        children: [
          // Avatar — rightmost
          Container(
            width: 42,
            height: 42,
            decoration: const BoxDecoration(
              color: Color(0xFFEF865F),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                initials,
                style: const TextStyle(
                  fontFamily: 'Rubik',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Row: name (right) + date (left) + delete (far left)
                Row(
                  textDirection: TextDirection.rtl,
                  children: [
                    // Name
                    Flexible(
                      child: Text(
                        author?.fullName ?? 'مستخدم',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyles.body.copyWith(
                          color: const Color(0xFF373D41),
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    // Date
                    Text(
                      _formatDate(post.createdAt),
                      style: AppTextStyles.small.copyWith(
                        color: const Color(0xFFADB5BB),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const Spacer(),
                    // Delete icon — far left
                    if (isOwner)
                      GestureDetector(
                        onTap: () => _confirmDelete(context),
                        child: const Icon(Icons.delete_outline_rounded,
                            color: Color(0xFFADB5BB), size: 18),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                // Post content
                Text(
                  post.content,
                  textAlign: TextAlign.right,
                  textDirection: TextDirection.rtl,
                  style: AppTextStyles.small.copyWith(
                    color: const Color(0xFF868687),
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 8),
                // Like + comment — right-aligned, icon to the right of text
                Row(
                  textDirection: TextDirection.rtl,
                  children: [
                    // أعجبني
                    GestureDetector(
                      onTap: onLike,
                      child: Row(
                        textDirection: TextDirection.rtl,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.favorite_border_rounded,
                              color: Color(0xFF868687), size: 18),
                          const SizedBox(width: 4),
                          Text(
                            post.likesCount > 0
                                ? '${post.likesCount} أعجبني'
                                : 'أعجبني',
                            style: AppTextStyles.small.copyWith(
                              color: const Color(0xFF868687),
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    // تعليق
                    GestureDetector(
                      onTap: onComment,
                      child: Row(
                        textDirection: TextDirection.rtl,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.chat_bubble_outline_rounded,
                              color: Color(0xFF868687), size: 17),
                          const SizedBox(width: 4),
                          Text(
                            post.commentsCount > 0
                                ? '${post.commentsCount} تعليق'
                                : 'تعليق',
                            style: AppTextStyles.small.copyWith(
                              color: const Color(0xFF868687),
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => Directionality(
        textDirection: TextDirection.rtl,
        child: AlertDialog(
          title: const Text('حذف المنشور'),
          content: const Text('هل تريد حذف هذا المنشور؟'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('إلغاء',
                  style: TextStyle(color: AppColors.textSecondary)),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                onDelete();
              },
              child: const Text('حذف',
                  style: TextStyle(color: AppColors.error)),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Comments bottom sheet ─────────────────────────────────────────────────────

class _CommentsSheet extends StatefulWidget {
  final PostModel post;
  final String currentUserId;

  const _CommentsSheet({required this.post, required this.currentUserId});

  @override
  State<_CommentsSheet> createState() => _CommentsSheetState();
}

class _CommentsSheetState extends State<_CommentsSheet> {
  final _commentCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  List<CommentModel> _comments = [];
  bool _loading = true;
  bool _posting = false;

  @override
  void initState() {
    super.initState();
    _loadComments();
  }

  @override
  void dispose() {
    _commentCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadComments() async {
    try {
      final comments = await communityService.getComments(widget.post.id);
      if (mounted) setState(() { _comments = comments; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _submit() async {
    final content = _commentCtrl.text.trim();
    if (content.isEmpty || _posting) return;
    setState(() => _posting = true);
    try {
      final newComment =
          await communityService.createComment(widget.post.id, content);
      _commentCtrl.clear();
      setState(() {
        _comments.add(newComment);
        _posting = false;
      });
      await Future.delayed(const Duration(milliseconds: 100));
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _posting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('فشل إرسال التعليق: ${e.toString()}',
                textDirection: TextDirection.rtl),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  Future<void> _deleteComment(CommentModel comment) async {
    try {
      await communityService.deleteComment(widget.post.id, comment.id);
      setState(() => _comments.removeWhere((c) => c.id == comment.id));
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('فشل حذف التعليق', textDirection: TextDirection.rtl),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final d = DateTime(date.year, date.month, date.day);
    if (d == today) return 'اليوم';
    return '${date.day}/${date.month}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Padding(
      padding: EdgeInsets.only(bottom: bottomInset),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: SizedBox(
          height: MediaQuery.of(context).size.height * 0.75,
          child: Column(
            children: [
              // Handle
              Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              // Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: const Icon(Icons.close_rounded,
                          color: Color(0xFF373D41), size: 22),
                    ),
                    const Spacer(),
                    Text(
                      'التعليقات',
                      style: AppTextStyles.body.copyWith(
                        color: const Color(0xFF495055),
                        fontWeight: FontWeight.w700,
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              // Post content preview
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                color: const Color(0xFFFFF6EA),
                child: Text(
                  widget.post.content,
                  textAlign: TextAlign.right,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.small.copyWith(
                    color: const Color(0xFF868687),
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
              ),
              const Divider(height: 1),
              // Comments list
              Expanded(
                child: _loading
                    ? const Center(
                        child: CircularProgressIndicator(
                            color: AppColors.primary))
                    : _comments.isEmpty
                        ? Center(
                            child: Text('لا توجد تعليقات بعد',
                                style: AppTextStyles.body.copyWith(
                                    color: AppColors.textSecondary)),
                          )
                        : ListView.separated(
                            controller: _scrollCtrl,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 8),
                            itemCount: _comments.length,
                            separatorBuilder: (_, __) =>
                                const Divider(height: 1),
                            itemBuilder: (_, i) {
                              final c = _comments[i];
                              final isOwner =
                                  c.author?.id == widget.currentUserId;
                              return Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 10),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.end,
                                            children: [
                                              if (isOwner)
                                                GestureDetector(
                                                  onTap: () =>
                                                      _deleteComment(c),
                                                  child: const Padding(
                                                    padding: EdgeInsets.only(
                                                        left: 4),
                                                    child: Icon(
                                                        Icons
                                                            .delete_outline_rounded,
                                                        color:
                                                            Color(0xFFADB5BB),
                                                        size: 16),
                                                  ),
                                                ),
                                              Text(
                                                _formatDate(c.createdAt),
                                                style:
                                                    AppTextStyles.small.copyWith(
                                                  color:
                                                      const Color(0xFFADB5BB),
                                                  fontSize: 11,
                                                ),
                                              ),
                                              const SizedBox(width: 6),
                                              Text(
                                                c.author?.fullName ?? 'مستخدم',
                                                style:
                                                    AppTextStyles.body.copyWith(
                                                  color:
                                                      const Color(0xFF373D41),
                                                  fontWeight: FontWeight.w600,
                                                  fontSize: 14,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            c.content,
                                            textAlign: TextAlign.right,
                                            style:
                                                AppTextStyles.small.copyWith(
                                              color: const Color(0xFF868687),
                                              fontSize: 13,
                                              height: 1.5,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Container(
                                      width: 34,
                                      height: 34,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFFEF865F),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Center(
                                        child: Text(
                                          c.author?.initials ?? '؟',
                                          style: const TextStyle(
                                            fontFamily: 'Rubik',
                                            fontSize: 13,
                                            fontWeight: FontWeight.w700,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
              ),
              // Comment input
              const Divider(height: 1),
              Padding(
                padding: const EdgeInsets.fromLTRB(12, 10, 12, 16),
                child: Row(
                  children: [
                    // Send button
                    GestureDetector(
                      onTap: _submit,
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: _posting
                            ? const Padding(
                                padding: EdgeInsets.all(10),
                                child: CircularProgressIndicator(
                                    color: Colors.white, strokeWidth: 2))
                            : const Icon(Icons.send_rounded,
                                color: Colors.white, size: 20),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Text field
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F5F5),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: TextField(
                          controller: _commentCtrl,
                          textAlign: TextAlign.right,
                          textDirection: TextDirection.rtl,
                          maxLines: 3,
                          minLines: 1,
                          style: AppTextStyles.body.copyWith(fontSize: 14),
                          decoration: InputDecoration(
                            hintText: 'اكتب تعليقًا...',
                            hintTextDirection: TextDirection.rtl,
                            hintStyle: AppTextStyles.body.copyWith(
                              color: AppColors.textHint,
                              fontSize: 14,
                            ),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 10),
                          ),
                          onSubmitted: (_) => _submit(),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── New post bottom sheet ─────────────────────────────────────────────────────

class _NewPostSheet extends StatefulWidget {
  final VoidCallback onPosted;
  const _NewPostSheet({required this.onPosted});

  @override
  State<_NewPostSheet> createState() => _NewPostSheetState();
}

class _NewPostSheetState extends State<_NewPostSheet> {
  final _contentController = TextEditingController();
  bool _posting = false;

  @override
  void dispose() {
    _contentController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final content = _contentController.text.trim();
    if (content.isEmpty) return;

    setState(() => _posting = true);
    try {
      await communityService.createPost(content);
      widget.onPosted();
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) {
        setState(() => _posting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('فشل نشر المنشور: ${e.toString()}',
                textDirection: TextDirection.rtl),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Padding(
      padding: EdgeInsets.only(bottom: bottomInset),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: Row(
                children: [
                  _posting
                      ? const SizedBox(
                          width: 32,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: AppColors.primary))
                      : GestureDetector(
                          onTap: _submit,
                          child: Text(
                            'نشر',
                            style: AppTextStyles.body.copyWith(
                              color: const Color(0xFF84919A),
                              fontWeight: FontWeight.w500,
                              fontSize: 16,
                            ),
                          ),
                        ),
                  Expanded(
                    child: Text(
                      'منشور جديد في المجتمع',
                      textAlign: TextAlign.center,
                      style: AppTextStyles.body.copyWith(
                        color: const Color(0xFF495055),
                        fontWeight: FontWeight.w500,
                        fontSize: 18,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.close_rounded,
                        color: Color(0xFF373D41), size: 24),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: Text(
                'شارك تجربتك أو سؤالك مع مجتمع صوت اليد',
                textAlign: TextAlign.right,
                style: AppTextStyles.body.copyWith(
                  color: const Color(0xFF84919A),
                  fontSize: 14,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'نص المنشور',
                    style: AppTextStyles.small.copyWith(
                      color: const Color(0xFF495055),
                      fontWeight: FontWeight.w500,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF6EA),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primary),
                    ),
                    child: TextField(
                      controller: _contentController,
                      maxLines: 5,
                      minLines: 4,
                      textAlign: TextAlign.right,
                      textDirection: TextDirection.rtl,
                      style: AppTextStyles.body.copyWith(fontSize: 15),
                      decoration: InputDecoration(
                        hintText: 'اكتب رأيك، تجربتك، أو سؤالك هنا...',
                        hintTextDirection: TextDirection.rtl,
                        hintStyle: AppTextStyles.body.copyWith(
                          color: AppColors.textHint,
                          fontSize: 14,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.all(16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
