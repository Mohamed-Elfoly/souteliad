import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../data/auth_service.dart';
import '../../../../core/widgets/pill_text_field.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  bool _isLoading = false;
  String? _errorMsg;
  bool _sent = false;

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      await authService.forgotPassword(_emailCtrl.text.trim());
      if (!mounted) return;
      setState(() => _sent = true);
      context.push(AppRoutes.verifyCode);
    } catch (e) {
      setState(() => _errorMsg = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
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

              // Back button row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'إعادة تعيين كلمة المرور',
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

              // Logo
              Image.asset(
                'assets/images/logo1.png',
                width: 140,
                fit: BoxFit.contain,
              ),

              const SizedBox(height: 32),

              if (_sent) ...[
                // Success state
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.successLight,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.mark_email_read_outlined,
                          size: 48, color: AppColors.success),
                      const SizedBox(height: 12),
                      Text(
                        'تم إرسال رابط الاسترجاع!',
                        style: AppTextStyles.h3
                            .copyWith(color: AppColors.success),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'تحقق من بريدك الإلكتروني واتبع التعليمات.',
                        style: AppTextStyles.body
                            .copyWith(color: AppColors.textSecondary),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 28),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () => context.pop(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                    child: const Text(
                      'العودة لتسجيل الدخول',
                      style: TextStyle(
                        fontFamily: 'Rubik',
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.white,
                      ),
                    ),
                  ),
                ),
              ] else ...[
                // Instruction text
                Text(
                  'أدخل بريدك الإلكتروني لإرسال تعليمات استرجاع كلمة المرور.',
                  textAlign: TextAlign.right,
                  style: AppTextStyles.body.copyWith(
                    color: const Color(0xFF495055),
                    fontSize: 14,
                    height: 1.6,
                  ),
                ),

                const SizedBox(height: 28),

                Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'البريد الإلكتروني',
                        style: AppTextStyles.small.copyWith(
                          color: const Color(0xFF6B7280),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 8),
                      PillTextField(
                        controller: _emailCtrl,
                        hint: 'أدخل البريد الإلكتروني',
                        keyboardType: TextInputType.emailAddress,
                        suffixIcon: const Icon(Icons.mail_outline,
                            color: AppColors.textHint, size: 20),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) {
                            return 'البريد الإلكتروني مطلوب';
                          }
                          if (!v.contains('@')) {
                            return 'بريد إلكتروني غير صحيح';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

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
                      style: AppTextStyles.small
                          .copyWith(color: AppColors.error, fontSize: 13),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      disabledBackgroundColor:
                          AppColors.primary.withOpacity(0.6),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                                color: AppColors.white, strokeWidth: 2),
                          )
                        : const Text(
                            'إرسال',
                            style: TextStyle(
                              fontFamily: 'Rubik',
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: AppColors.white,
                            ),
                          ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
