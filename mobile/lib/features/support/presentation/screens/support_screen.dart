import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../providers/auth_provider.dart';
import '../../data/support_service.dart';

class SupportScreen extends ConsumerStatefulWidget {
  const SupportScreen({super.key});

  @override
  ConsumerState<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends ConsumerState<SupportScreen> {
  final _subjectCtrl = TextEditingController();
  final _messageCtrl = TextEditingController();
  bool _sending = false;

  @override
  void dispose() {
    _subjectCtrl.dispose();
    _messageCtrl.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    if (_subjectCtrl.text.trim().isEmpty ||
        _messageCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('يرجى ملء جميع الحقول',
              textDirection: TextDirection.rtl),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    setState(() => _sending = true);
    try {
      final user = ref.read(authProvider).user;
      await supportService.createTicket(
        fullName: user?.fullName ?? '',
        email: user?.email ?? '',
        reason: _subjectCtrl.text.trim(),
        message: _messageCtrl.text.trim(),
      );
      if (mounted) {
        _subjectCtrl.clear();
        _messageCtrl.clear();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('تم إرسال رسالتك بنجاح ✓',
                textDirection: TextDirection.rtl),
            backgroundColor: Colors.green,
          ),
        );
        context.pop();
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('حدث خطأ، حاول مرة أخرى',
                textDirection: TextDirection.rtl),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                textDirection: TextDirection.rtl,
                children: [
                  const Text(
                    'الدعم والمساعدة',
                    style: TextStyle(
                      fontFamily: 'Rubik',
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF373D41),
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: const Icon(Icons.arrow_forward_ios_rounded,
                        size: 20, color: Color(0xFF373D41)),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 8),
                child: Directionality(
                  textDirection: TextDirection.rtl,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'نحن هنا لمساعدتك',
                        style: TextStyle(
                          fontFamily: 'Rubik',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF373D41),
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'إذا كان لديك أي أسئلة أو ملاحظات، يسعدنا مساعدتك. أرسل رسالتك وسنرد عليك في أقرب وقت ممكن.',
                        style: TextStyle(
                          fontFamily: 'Rubik',
                          fontSize: 13,
                          color: Color(0xFF868687),
                          height: 1.6,
                        ),
                      ),

                      const SizedBox(height: 20),

                      const Text(
                        'طرق التواصل المباشر:',
                        style: TextStyle(
                          fontFamily: 'Rubik',
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF373D41),
                        ),
                      ),
                      const SizedBox(height: 10),
                      _ContactButton(
                        icon: Icons.phone_outlined,
                        label: '01156809001',
                        color: AppColors.primary,
                      ),
                      const SizedBox(height: 10),
                      _ContactButton(
                        icon: Icons.email_outlined,
                        label: 'sawt.Elyad@gmail.com',
                        color: AppColors.primary,
                      ),

                      const SizedBox(height: 28),

                      const Text(
                        'أرسل رسالة:',
                        style: TextStyle(
                          fontFamily: 'Rubik',
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF373D41),
                        ),
                      ),
                      const SizedBox(height: 14),

                      _SupportField(
                        label: 'سبب التواصل',
                        hint: 'اكتب سبب التواصل',
                        controller: _subjectCtrl,
                        icon: Icons.help_outline_rounded,
                      ),
                      const SizedBox(height: 14),

                      const Text(
                        'الرسالة',
                        style: TextStyle(
                          fontFamily: 'Rubik',
                          fontSize: 13,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _messageCtrl,
                        maxLines: 5,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          hintText: 'اكتب الرسالة',
                          hintStyle: const TextStyle(
                            fontFamily: 'Rubik',
                            fontSize: 14,
                            color: Color(0xFFAAAAAA),
                          ),
                          contentPadding: const EdgeInsets.all(16),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide:
                                const BorderSide(color: Color(0xFFD1D5DB)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide:
                                const BorderSide(color: Color(0xFFD1D5DB)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(
                                color: AppColors.primary, width: 1.5),
                          ),
                        ),
                      ),

                      const SizedBox(height: 28),

                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          onPressed: _sending ? null : _send,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20)),
                            elevation: 0,
                          ),
                          child: _sending
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                      color: Colors.white, strokeWidth: 2),
                                )
                              : const Text(
                                  'إرسال',
                                  style: TextStyle(
                                    fontFamily: 'Rubik',
                                    fontSize: 20,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white,
                                  ),
                                ),
                        ),
                      ),

                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ContactButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _ContactButton(
      {required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontFamily: 'Rubik',
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 8),
          Icon(icon, color: Colors.white, size: 20),
        ],
      ),
    );
  }
}

class _SupportField extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final IconData icon;

  const _SupportField({
    required this.label,
    required this.hint,
    required this.controller,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontFamily: 'Rubik',
            fontSize: 13,
            color: Color(0xFF6B7280),
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          textAlign: TextAlign.right,
          textDirection: TextDirection.rtl,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(
              fontFamily: 'Rubik',
              fontSize: 14,
              color: Color(0xFFAAAAAA),
            ),
            prefixIcon: Icon(icon, color: AppColors.primary, size: 20),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(360),
              borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(360),
              borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(360),
              borderSide:
                  const BorderSide(color: AppColors.primary, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }
}
