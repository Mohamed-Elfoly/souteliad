import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/pill_text_field.dart';
import '../../../../providers/auth_provider.dart';
import '../../data/auth_service.dart';
import 'success_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;
  bool _isLoading = false;
  String? _errorMsg;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      final result = await authService.login(
        email: _emailCtrl.text.trim(),
        password: _passwordCtrl.text,
      );
      if (!mounted) return;
      final user = result['user'];
      if (user.role != 'student' && user.role != 'user') {
        setState(() =>
            _errorMsg = 'هذا التطبيق مخصص للطلاب فقط. يرجى استخدام لوحة التحكم.');
        return;
      }
      await ref.read(authProvider.notifier).login(
            result['token'],
            user,
          );
      if (!mounted) return;
      pushSuccess(
        context,
        title: 'تهانينا!',
        subtitle: 'تم تسجيل الدخول بنجاح.',
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
                const SizedBox(height: 40),

                // Logo
                Image.asset(
                  'assets/images/logo1.png',
                  width: 160,
                  fit: BoxFit.contain,
                ),

                const SizedBox(height: 32),

                // Title
                Text(
                  'تسجيل الدخول',
                  style: AppTextStyles.h2.copyWith(
                    color: const Color(0xFF373D41),
                  ),
                ),

                const SizedBox(height: 28),

                // Email field
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

                // Password field
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

                const SizedBox(height: 16),

                // Remember me + Forgot password row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Remember me
                    Row(
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            value: _rememberMe,
                            onChanged: (v) =>
                                setState(() => _rememberMe = v ?? false),
                            activeColor: AppColors.primary,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'ذكّرني',
                          style: AppTextStyles.body.copyWith(
                            color: const Color(0xFF373D41),
                          ),
                        ),
                      ],
                    ),
                    // Forgot password
                    GestureDetector(
                      onTap: () => context.push(AppRoutes.forgotPassword),
                      child: Text(
                        'نسيت كلمة المرور؟',
                        style: AppTextStyles.body.copyWith(
                          color: const Color(0xFFD65F32),
                          letterSpacing: 0.28,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 28),

                // Error message
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
                        color: AppColors.error,
                        fontSize: 13,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Login button
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
                        borderRadius: BorderRadius.circular(20),
                      ),
                      elevation: 0,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              color: AppColors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Text(
                            'تسجيل الدخول',
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

                // Signup link
                GestureDetector(
                  onTap: () => context.go(AppRoutes.signup),
                  child: RichText(
                    textDirection: TextDirection.rtl,
                    text: TextSpan(
                      style: AppTextStyles.body.copyWith(fontSize: 16),
                      children: [
                        const TextSpan(
                          text: 'ليس لدي حساب بعد؟  ',
                          style: TextStyle(color: Color(0xFF495055)),
                        ),
                        TextSpan(
                          text: 'إنشاء حساب جديد',
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
        style: AppTextStyles.small.copyWith(
          color: const Color(0xFF6B7280),
          fontSize: 14,
        ),
      ),
    );
  }
}

