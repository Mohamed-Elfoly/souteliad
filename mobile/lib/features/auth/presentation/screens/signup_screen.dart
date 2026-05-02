import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../providers/auth_provider.dart';
import '../../data/auth_service.dart';
import '../../../../core/widgets/pill_text_field.dart';
import 'success_screen.dart';

class SignupScreen extends ConsumerStatefulWidget {
  const SignupScreen({super.key});

  @override
  ConsumerState<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends ConsumerState<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameCtrl = TextEditingController();
  final _ageCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  bool _isLoading = false;
  String? _errorMsg;

  @override
  void dispose() {
    _fullNameCtrl.dispose();
    _ageCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    final parts = _fullNameCtrl.text.trim().split(' ');
    final firstName = parts.first;
    final lastName = parts.length > 1 ? parts.sublist(1).join(' ') : '.';

    try {
      final result = await authService.signup(
        firstName: firstName,
        lastName: lastName,
        email: _emailCtrl.text.trim(),
        password: _passwordCtrl.text,
        passwordConfirm: _confirmCtrl.text,
      );
      if (!mounted) return;
      await ref
          .read(authProvider.notifier)
          .login(result['token'], result['user']);
      if (!mounted) return;
      pushSuccess(
        context,
        title: 'تهانينا!',
        subtitle: 'تم إنشاء الحساب بنجاح.',
        nextRoute: AppRoutes.home,
      );
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
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                const SizedBox(height: 32),

                // Logo
                Image.asset(
                  'assets/images/logo1.png',
                  width: 140,
                  fit: BoxFit.contain,
                ),

                const SizedBox(height: 24),

                // Title
                Text(
                  'إنشاء حساب جديد',
                  style: AppTextStyles.h2
                      .copyWith(color: const Color(0xFF373D41)),
                ),

                const SizedBox(height: 28),

                // Full name
                _buildLabel('الاسم الكامل'),
                const SizedBox(height: 8),
                PillTextField(
                  controller: _fullNameCtrl,
                  hint: 'أدخل الاسم الكامل',
                  suffixIcon: const Icon(Icons.person_outline,
                      color: AppColors.textHint, size: 20),
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'الاسم الكامل مطلوب' : null,
                ),

                const SizedBox(height: 20),

                // Age
                _buildLabel('العمر'),
                const SizedBox(height: 8),
                PillTextField(
                  controller: _ageCtrl,
                  hint: 'أدخل العمر',
                  keyboardType: TextInputType.number,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'العمر مطلوب' : null,
                ),

                const SizedBox(height: 20),

                // Email
                _buildLabel('البريد الإلكتروني'),
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
                    if (!v.contains('@')) return 'بريد إلكتروني غير صحيح';
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Password
                _buildLabel('كلمة المرور'),
                const SizedBox(height: 8),
                PillTextField(
                  controller: _passwordCtrl,
                  hint: 'أدخل كلمة المرور',
                  obscureText: _obscurePassword,
                  suffixIcon: GestureDetector(
                    onTap: () =>
                        setState(() => _obscurePassword = !_obscurePassword),
                    child: Icon(
                      _obscurePassword
                          ? Icons.lock_outline
                          : Icons.lock_open_outlined,
                      color: AppColors.textHint,
                      size: 20,
                    ),
                  ),
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'كلمة المرور مطلوبة';
                    if (v.length < 8) return 'كلمة المرور 8 أحرف على الأقل';
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Confirm password
                _buildLabel('تأكيد كلمة المرور'),
                const SizedBox(height: 8),
                PillTextField(
                  controller: _confirmCtrl,
                  hint: 'أدخل تأكيد كلمة المرور',
                  obscureText: _obscureConfirm,
                  suffixIcon: GestureDetector(
                    onTap: () =>
                        setState(() => _obscureConfirm = !_obscureConfirm),
                    child: Icon(
                      _obscureConfirm
                          ? Icons.lock_outline
                          : Icons.lock_open_outlined,
                      color: AppColors.textHint,
                      size: 20,
                    ),
                  ),
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'تأكيد كلمة المرور مطلوب';
                    if (v != _passwordCtrl.text) {
                      return 'كلمتا المرور غير متطابقتين';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 28),

                // Error
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

                // Signup button
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
                            'إنشاء حساب جديد',
                            style: TextStyle(
                              fontFamily: 'Rubik',
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: AppColors.white,
                            ),
                          ),
                  ),
                ),

                const SizedBox(height: 20),

                // Login link
                GestureDetector(
                  onTap: () => context.go(AppRoutes.login),
                  child: RichText(
                    textDirection: TextDirection.rtl,
                    text: TextSpan(
                      style: AppTextStyles.body.copyWith(fontSize: 16),
                      children: [
                        const TextSpan(
                          text: 'لدي حساب بالفعل؟  ',
                          style: TextStyle(color: Color(0xFF495055)),
                        ),
                        TextSpan(
                          text: 'تسجيل الدخول',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Align(
      alignment: AlignmentDirectional.centerEnd,
      child: Text(
        text,
        style: AppTextStyles.small
            .copyWith(color: const Color(0xFF6B7280), fontSize: 14),
      ),
    );
  }
}
