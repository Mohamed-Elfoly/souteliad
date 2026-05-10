import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../data/auth_service.dart';
import 'success_screen.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String token;

  const ResetPasswordScreen({super.key, required this.token});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _passwordCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  bool _isLoading = false;
  String? _errorMsg;

  @override
  void dispose() {
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final password = _passwordCtrl.text;
    final confirm = _confirmCtrl.text;

    if (password.isEmpty || confirm.isEmpty) {
      setState(() => _errorMsg = 'يرجى ملء جميع الحقول');
      return;
    }
    if (password != confirm) {
      setState(() => _errorMsg = 'كلمتا المرور غير متطابقتان');
      return;
    }
    if (password.length < 8) {
      setState(() => _errorMsg = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      await authService.resetPassword(
        token: widget.token,
        password: password,
        passwordConfirm: confirm,
      );
      if (!mounted) return;
      pushSuccess(
        context,
        title: 'تهانينا!',
        subtitle: 'تم التغيير بنجاح!',
        body: 'تم تحديث كلمة المرور الخاصة بك. احرص على حفظها.',
        nextRoute: AppRoutes.login,
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
          child: Column(
            children: [
              const SizedBox(height: 16),

              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'كلمة مرور جديدة',
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

              Image.asset(
                'assets/images/logo1.png',
                width: 140,
                fit: BoxFit.contain,
              ),

              const SizedBox(height: 32),

              Text(
                'أدخل كلمة المرور الجديدة',
                textAlign: TextAlign.center,
                style: AppTextStyles.body.copyWith(
                  color: const Color(0xFF495055),
                  fontSize: 14,
                  height: 1.6,
                ),
              ),

              const SizedBox(height: 28),

              // New password
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'كلمة المرور الجديدة',
                    style: AppTextStyles.small
                        .copyWith(color: const Color(0xFF6B7280), fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  _PasswordField(
                    controller: _passwordCtrl,
                    hint: 'أدخل كلمة المرور',
                    obscure: _obscurePassword,
                    onToggle: () =>
                        setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Confirm password
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'تأكيد كلمة المرور',
                    style: AppTextStyles.small
                        .copyWith(color: const Color(0xFF6B7280), fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  _PasswordField(
                    controller: _confirmCtrl,
                    hint: 'أعد إدخال كلمة المرور',
                    obscure: _obscureConfirm,
                    onToggle: () =>
                        setState(() => _obscureConfirm = !_obscureConfirm),
                  ),
                ],
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
                          'تغيير كلمة المرور',
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
          ),
        ),
      ),
    );
  }
}

class _PasswordField extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final bool obscure;
  final VoidCallback onToggle;

  const _PasswordField({
    required this.controller,
    required this.hint,
    required this.obscure,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      textAlign: TextAlign.right,
      textDirection: TextDirection.rtl,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(
          fontFamily: 'Rubik',
          color: AppColors.textHint,
          fontSize: 14,
        ),
        suffixIcon: GestureDetector(
          onTap: onToggle,
          child: Icon(
            obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
            color: AppColors.textHint,
            size: 20,
          ),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        filled: true,
        fillColor: AppColors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(360),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(360),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(360),
          borderSide:
              const BorderSide(color: AppColors.primary, width: 1.5),
        ),
      ),
    );
  }
}
