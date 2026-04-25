import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../providers/stats_provider.dart';
import '../../../../providers/levels_provider.dart';
import '../../data/lessons_service.dart';

class LessonPlayerScreen extends ConsumerStatefulWidget {
  final String lessonId;
  final String videoUrl;
  final String title;

  const LessonPlayerScreen({
    super.key,
    required this.lessonId,
    required this.videoUrl,
    required this.title,
  });

  @override
  ConsumerState<LessonPlayerScreen> createState() => _LessonPlayerScreenState();
}

class _LessonPlayerScreenState extends ConsumerState<LessonPlayerScreen> {
  late VideoPlayerController _videoController;
  ChewieController? _chewieController;
  bool _hasError = false;
  bool _isInitialized = false;
  bool _markedComplete = false;

  @override
  void initState() {
    super.initState();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
    ]);
    _initPlayer();
  }

  Future<void> _initPlayer() async {
    try {
      _videoController = VideoPlayerController.networkUrl(
        Uri.parse(widget.videoUrl),
      );
      await _videoController.initialize();
      _videoController.addListener(_onVideoProgress);
      _chewieController = ChewieController(
        videoPlayerController: _videoController,
        autoPlay: true,
        looping: false,
        allowFullScreen: true,
        allowMuting: true,
        showControls: true,
        materialProgressColors: ChewieProgressColors(
          playedColor: AppColors.primary,
          handleColor: AppColors.primary,
          backgroundColor: const Color(0xFFDDDEDF),
          bufferedColor: const Color(0xFFFFCCAA),
        ),
        placeholder: Container(color: Colors.black),
        errorBuilder: (context, errorMessage) => Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline, color: Colors.white, size: 48),
              const SizedBox(height: 12),
              Text(
                'تعذّر تشغيل الفيديو',
                style: AppTextStyles.body.copyWith(color: Colors.white),
              ),
            ],
          ),
        ),
      );
      setState(() => _isInitialized = true);
    } catch (_) {
      setState(() => _hasError = true);
    }
  }

  void _onVideoProgress() {
    if (_markedComplete) return;
    final pos = _videoController.value.position;
    final dur = _videoController.value.duration;
    if (dur.inSeconds > 0 && pos.inSeconds >= dur.inSeconds - 2) {
      _markComplete();
    }
  }

  Future<void> _markComplete() async {
    if (_markedComplete) return;
    _markedComplete = true;
    try {
      await levelsService.markLessonComplete(widget.lessonId);
      if (mounted) {
        ref.invalidate(studentStatsProvider);
        ref.invalidate(levelsProvider);
      }
    } catch (_) {
      _markedComplete = false;
    }
  }

  @override
  void dispose() {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    _videoController.removeListener(_onVideoProgress);
    _videoController.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context),
            AspectRatio(
              aspectRatio: 16 / 9,
              child: _buildPlayerArea(),
            ),
            Expanded(
              child: Container(
                width: double.infinity,
                color: AppColors.white,
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      widget.title,
                      textAlign: TextAlign.right,
                      style: AppTextStyles.h3.copyWith(
                        color: const Color(0xFF373D41),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 16),
                    if (_isInitialized)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (_markedComplete)
                            Text(
                              'تم إكمال الدرس',
                              style: AppTextStyles.small.copyWith(
                                color: Colors.green,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            )
                          else
                            Text(
                              'جارٍ تشغيل الدرس',
                              style: AppTextStyles.small.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 13,
                              ),
                            ),
                          const SizedBox(width: 8),
                          Icon(
                            _markedComplete
                                ? Icons.check_circle_outline
                                : Icons.play_circle_outline,
                            color: _markedComplete
                                ? Colors.green
                                : AppColors.primary,
                            size: 20,
                          ),
                        ],
                      ),
                    const Spacer(),
                    // Mark complete manually if not done automatically
                    if (!_markedComplete)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: _markComplete,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20)),
                            ),
                            child: const Text(
                              'تم — سجّل إكمال الدرس',
                              style: TextStyle(
                                fontFamily: 'Rubik',
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton(
                        onPressed: () => context.pop(),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.primary),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20)),
                        ),
                        child: const Text(
                          'العودة إلى الدرس',
                          style: TextStyle(
                            fontFamily: 'Rubik',
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      color: Colors.black,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_forward_ios_rounded,
                color: Colors.white, size: 20),
            onPressed: () => context.pop(),
            padding: EdgeInsets.zero,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              widget.title,
              textAlign: TextAlign.right,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontFamily: 'Rubik',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerArea() {
    if (_hasError) {
      return Container(
        color: Colors.black,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.wifi_off_outlined,
                  color: Colors.white54, size: 48),
              const SizedBox(height: 12),
              Text(
                'تعذّر تشغيل الفيديو',
                style: AppTextStyles.body.copyWith(color: Colors.white70),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  setState(() {
                    _hasError = false;
                    _isInitialized = false;
                    _markedComplete = false;
                  });
                  _initPlayer();
                },
                child: const Text(
                  'إعادة المحاولة',
                  style: TextStyle(color: AppColors.primary),
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (!_isInitialized) {
      return Container(
        color: Colors.black,
        child: const Center(
          child: CircularProgressIndicator(
            color: AppColors.primary,
            strokeWidth: 2,
          ),
        ),
      );
    }

    return Chewie(controller: _chewieController!);
  }
}
