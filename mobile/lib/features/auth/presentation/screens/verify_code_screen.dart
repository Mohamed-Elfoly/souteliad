import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/pill_text_field.dart';

class VerifyCodeScreen extends StatefulWidget {
  const VerifyCodeScreen({super.key});

  @override
  State<VerifyCodeScreen> createState() => _VerifyCodeScreenState();
}

class _VerifyCodeScreenState extends State<VerifyCodeScreen> {
  final _tokenCtrl = TextEditingController();
  String? _errorMsg;

  @override
  void dispose() {
    _tokenCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    final token = _tokenCtrl.text.trim();
    if (token.isEmpty) {
      setState(() => _errorMsg = 'يرجى إدخال الرمز');
      return;
    }
    context.push(AppRoutes.resetPassword, extra: {'token': token});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const SizedBox(height: 16),

              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'تأكيد الرمز',
                    style: AppTextStyles.h3.copyWith(
                      color: Colors.black,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.arrow_forward_ios,
                        size: 20, color: Colors.black),
                    onPressed: () => context.pop(),
                  ),
                ],
              ),

              const SizedBox(height: 48),

              // Icon
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: const Icon(
                  Icons.mark_email_read_outlined,
                  size: 52,
                  color: AppColors.primary,
                ),
              ),

              const SizedBox(height: 28),

              Text(
                'تحقق من بريدك الإلكتروني',
                textAlign: TextAlign.center,
                style: AppTextStyles.h2
                    .copyWith(color: AppColors.darkText, fontSize: 22),
              ),

              const SizedBox(height: 12),

              Text(
                'أدخل الرمز الذي تلقيته على بريدك الإلكتروني لإعادة تعيين كلمة المرور.',
                textAlign: TextAlign.center,
                style: AppTextStyles.body.copyWith(
                  color: AppColors.textSecondary,
                  height: 1.6,
                ),
              ),

              const SizedBox(height: 32),

              // Token field
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'رمز إعادة التعيين',
                    style: AppTextStyles.small
                        .copyWith(color: const Color(0xFF6B7280)),
                  ),
                  const SizedBox(height: 8),
                  PillTextField(
                    controller: _tokenCtrl,
                    hint: 'أدخل الرمز هنا',
                    suffixIcon: const Icon(Icons.key_outlined,
                        color: AppColors.textHint, size: 20),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              if (_errorMsg != null) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.errorLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _errorMsg!,
                    textAlign: TextAlign.center,
                    style: AppTextStyles.small.copyWith(
                        color: AppColors.error, fontSize: 13),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20)),
                    elevation: 0,
                  ),
                  child: const Text(
                    'التالي',
                    style: TextStyle(
                      fontFamily: 'Rubik',
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: AppColors.white,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Back to login
              GestureDetector(
                onTap: () => context.go(AppRoutes.login),
                child: Text(
                  'العودة إلى تسجيل الدخول',
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
