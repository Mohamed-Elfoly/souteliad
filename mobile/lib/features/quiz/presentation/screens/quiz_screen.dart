import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../models/quiz_model.dart';
import '../../../../models/question_model.dart';
import '../../../../models/lesson_model.dart';
import '../../data/quiz_service.dart';

final _quizProvider =
    FutureProvider.family<QuizModel, String>((ref, quizId) async {
  return quizService.getQuiz(quizId);
});

class QuizScreen extends ConsumerStatefulWidget {
  final String quizId;
  const QuizScreen({super.key, required this.quizId});

  @override
  ConsumerState<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends ConsumerState<QuizScreen> {
  int _currentIndex = 0;
  // questionId → selectedOptionId
  final Map<String, String?> _answers = {};
  bool _submitting = false;
  final Map<String, bool> _aiConfirmed = {};

  void _selectOption(String questionId, String optionId) {
    setState(() => _answers[questionId] = optionId);
  }

  Future<void> _onNext(QuizModel quiz) async {
    final isLast = _currentIndex == quiz.questions.length - 1;

    if (isLast) {
      await _submit(quiz);
    } else {
      setState(() => _currentIndex++);
    }
  }

  Future<void> _submit(QuizModel quiz) async {
    setState(() => _submitting = true);
    try {
      final answers = quiz.questions.map((q) {
        final selectedId = _answers[q.id];
        return {
          'questionId': q.id,
          if (selectedId != null) 'selectedOptionId': selectedId,
        };
      }).toList();

      final result = await quizService.submitQuiz(
        quizId: widget.quizId,
        answers: answers,
      );

      debugPrint('=== QUIZ RESULT: passed=${result.passed} lessonId=${quiz.lessonId}');
      if (mounted) {
        context.go(AppRoutes.quizResult, extra: {
          'score': result.score,
          'totalMarks': result.totalMarks,
          'passed': result.passed,
          'lessonId': quiz.lessonId,
          'videoUrl': null,
          'lessonTitle': null,
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _submitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('حدث خطأ أثناء الإرسال: ${e.toString()}',
                textDirection: TextDirection.rtl),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final quizAsync = ref.watch(_quizProvider(widget.quizId));

    return Scaffold(
      backgroundColor: AppColors.white,
      body: quizAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (err, _) => _buildError(err.toString()),
        data: (quiz) => _buildQuiz(quiz),
      ),
    );
  }

  Widget _buildError(String message) {
    return SafeArea(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 48, color: AppColors.error),
          const SizedBox(height: 12),
          Text(
            'تعذّر تحميل الاختبار',
            style: AppTextStyles.h3,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            message,
            style: AppTextStyles.small,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () =>
                ref.invalidate(_quizProvider(widget.quizId)),
            child: const Text(
              'إعادة المحاولة',
              style: TextStyle(color: AppColors.primary),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuiz(QuizModel quiz) {
    if (quiz.questions.isEmpty) {
      return SafeArea(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.quiz_outlined,
                  size: 64, color: AppColors.textHint),
              const SizedBox(height: 16),
              Text('لا توجد أسئلة في هذا الاختبار',
                  style: AppTextStyles.body),
              const SizedBox(height: 24),
              OutlinedButton(
                onPressed: () => context.pop(),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.primary),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 32, vertical: 12),
                ),
                child: const Text('العودة',
                    style: TextStyle(color: AppColors.primary)),
              ),
            ],
          ),
        ),
      );
    }

    final question = quiz.questions[_currentIndex];
    final total = quiz.questions.length;
    final progress = (_currentIndex + 1) / total;
    final isLast = _currentIndex == total - 1;

    return SafeArea(
      child: Column(
        children: [
          // Header
          _buildHeader(quiz.title),
          // Progress bar
          _buildProgressBar(progress, _currentIndex + 1, total),
          // Question content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Directionality(
                textDirection: TextDirection.rtl,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Question meta
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'سؤال ${_currentIndex + 1}',
                          style: AppTextStyles.small.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF0CF),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${question.marks} درجة',
                            style: AppTextStyles.small.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    // Question text
                    Text(
                      question.questionText,
                      style: AppTextStyles.h3.copyWith(
                        fontWeight: FontWeight.w700,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Question image (if any)
                    if (question.imageUrl != null) ...[
                      _buildQuestionImage(question.imageUrl!),
                      const SizedBox(height: 20),
                    ],
                    // Options or AI Practice
                    if (question.questionType == 'ai-practice')
                      _buildAiPracticeArea(question)
                    else
                      _buildOptions(question),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
          // Bottom button
          _buildNextButton(quiz, question, isLast),
        ],
      ),
    );
  }

  Widget _buildHeader(String title) {
    return Container(
      color: AppColors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_forward_ios_rounded,
                  color: AppColors.textPrimary, size: 20),
              onPressed: () => context.pop(),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                textAlign: TextAlign.right,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppTextStyles.h3.copyWith(fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressBar(double progress, int current, int total) {
    return Column(
      children: [
        Container(
          height: 1,
          color: AppColors.border,
        ),
        Padding(
          padding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '$current / $total',
                    style: AppTextStyles.small.copyWith(
                        color: AppColors.textSecondary, fontSize: 12),
                  ),
                  Text(
                    'التقدم',
                    style: AppTextStyles.small.copyWith(
                        color: AppColors.textSecondary, fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: progress,
                  minHeight: 8,
                  backgroundColor: const Color(0xFFE5E7EB),
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildQuestionImage(String imageUrl) {
    final resolved = LessonModel.resolveUrl(imageUrl) ?? imageUrl;
    return Container(
      width: double.infinity,
      height: 193,
      decoration: BoxDecoration(
        color: const Color(0xFFFFF0CF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFFCCAA), width: 1.5),
      ),
      clipBehavior: Clip.antiAlias,
      child: Image.network(
        resolved,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const Center(
          child: Icon(Icons.image_outlined, size: 48, color: AppColors.textHint),
        ),
      ),
    );
  }

  Widget _buildOptions(QuestionModel question) {
    final selected = _answers[question.id];
    return Column(
      children: question.options.asMap().entries.map((entry) {
        final option = entry.value;
        final isSelected = selected == option.id;
        return GestureDetector(
          onTap: () => _selectOption(question.id, option.id),
          child: Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 12),
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: isSelected
                  ? const Color(0xFFFFF6EA)
                  : AppColors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected
                    ? AppColors.primary
                    : const Color(0xFFD1D5DB),
                width: isSelected ? 1.5 : 1,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    option.text,
                    textAlign: TextAlign.right,
                    style: AppTextStyles.body.copyWith(
                      color: isSelected
                          ? AppColors.textPrimary
                          : AppColors.textSecondary,
                      fontWeight: isSelected
                          ? FontWeight.w600
                          : FontWeight.w400,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primary
                          : const Color(0xFFD1D5DB),
                      width: 2,
                    ),
                    color: isSelected
                        ? AppColors.primary
                        : AppColors.white,
                  ),
                  child: isSelected
                      ? const Icon(Icons.check,
                          color: Colors.white, size: 14)
                      : null,
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildAiPracticeArea(QuestionModel question) {
    final confirmed = _aiConfirmed[question.id] ?? false;

    if (confirmed) {
      return Column(
        children: [
          Container(
            height: 244,
            decoration: BoxDecoration(
              color: const Color(0xFFFFF0CF),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.check, color: Colors.white, size: 48),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'تم تأكيد الإجابة',
                    style: AppTextStyles.h3.copyWith(color: AppColors.darkText),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _aiConfirmed[question.id] = false),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primary),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('إعادة المحاولة',
                      style: TextStyle(fontFamily: 'Rubik', fontSize: 15,
                          fontWeight: FontWeight.w600, color: AppColors.primary)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    elevation: 0,
                  ),
                  child: const Text('تأكيد الإجابة',
                      style: TextStyle(fontFamily: 'Rubik', fontSize: 15,
                          fontWeight: FontWeight.w700, color: Colors.white)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildAiInstructions(question),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          height: 244,
          decoration: BoxDecoration(
            color: const Color(0xFFFFF0CF),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.primary, width: 2),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.camera_alt_outlined, size: 56, color: AppColors.primary),
              const SizedBox(height: 12),
              Text('هنا سيظهر الفيديو بعد تشغيل الكاميرا',
                  style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
                  textAlign: TextAlign.center),
            ],
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton.icon(
            onPressed: () => setState(() => _aiConfirmed[question.id] = true),
            icon: const Icon(Icons.videocam_outlined, color: Colors.white, size: 20),
            label: const Text('تشغيل الكاميرا',
                style: TextStyle(fontFamily: 'Rubik', fontSize: 15,
                    fontWeight: FontWeight.w600, color: Colors.white)),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            ),
          ),
        ),
        const SizedBox(height: 16),
        _buildAiInstructions(question),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Text('لن يتم حفظ صورة الكاميرا',
                style: AppTextStyles.small.copyWith(fontSize: 11)),
            const SizedBox(width: 4),
            const Icon(Icons.lock_outline, size: 13, color: AppColors.textSecondary),
          ],
        ),
      ],
    );
  }

  Widget _buildAiInstructions(QuestionModel question) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text('نص التعليمات:',
              style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          _instructionRow('اضغط على تشغيل الكاميرا'),
          _instructionRow('قف في المكان المناسب'),
          if (question.expectedSign != null)
            _instructionRow('أدِّ إشارة: ${question.expectedSign}'),
          _instructionRow('اضغط "تشغيل الكاميرا" لبدء التحليل'),
          const SizedBox(height: 8),
          Text('ملاحظة:',
              style: AppTextStyles.small.copyWith(fontWeight: FontWeight.w600, fontSize: 12)),
          const SizedBox(height: 4),
          Text(
            'يتم استخدام الكاميرا فقط لتحليل أداء إشارة لغة الإشارة لتقييم الإجابة. لن يتم حفظ الفيديو أو مشاركته مع أي طرف ثالث.',
            textAlign: TextAlign.right,
            style: AppTextStyles.small.copyWith(color: AppColors.textSecondary, fontSize: 11, height: 1.5),
          ),
        ],
      ),
    );
  }

  Widget _instructionRow(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(text,
              style: AppTextStyles.small.copyWith(
                  color: AppColors.textSecondary, fontSize: 12)),
          const SizedBox(width: 6),
          const Icon(Icons.circle,
              size: 6, color: AppColors.primary),
        ],
      ),
    );
  }

  Widget _buildNextButton(
      QuizModel quiz, QuestionModel question, bool isLast) {
    final hasAnswer = question.questionType == 'ai-practice' ||
        _answers[question.id] != null;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: Color(0xFFE5E7EB))),
      ),
      child: SizedBox(
        width: double.infinity,
        height: 50,
        child: _submitting
            ? const Center(
                child: CircularProgressIndicator(color: AppColors.primary),
              )
            : OutlinedButton(
                onPressed: hasAnswer ? () => _onNext(quiz) : null,
                style: OutlinedButton.styleFrom(
                  side: BorderSide(
                    color: hasAnswer
                        ? AppColors.primary
                        : AppColors.border,
                  ),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                  disabledForegroundColor:
                      AppColors.textHint,
                ),
                child: Text(
                  isLast ? 'إرسال الإجابات' : 'التالي',
                  style: TextStyle(
                    fontFamily: 'Rubik',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: hasAnswer
                        ? AppColors.primary
                        : AppColors.textHint,
                  ),
                ),
              ),
      ),
    );
  }
}
