import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../providers/auth_provider.dart';
import '../../data/user_service.dart';

class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() =>
      _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  late final TextEditingController _fullNameCtrl;
  late final TextEditingController _emailCtrl;
  bool _loading = false;
  File? _pickedImage;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    _fullNameCtrl = TextEditingController(text: user?.fullName ?? '');
    _emailCtrl = TextEditingController(text: user?.email ?? '');
  }

  @override
  void dispose() {
    _fullNameCtrl.dispose();
    _emailCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
      maxWidth: 800,
    );
    if (picked != null) {
      setState(() => _pickedImage = File(picked.path));
    }
  }

  Future<void> _save() async {
    if (_loading) return;
    final fullName = _fullNameCtrl.text.trim();
    final email = _emailCtrl.text.trim();
    if (fullName.isEmpty || email.isEmpty) return;

    final parts = fullName.split(' ');
    final firstName = parts.first;
    final lastName = parts.length > 1 ? parts.sublist(1).join(' ') : '';

    setState(() => _loading = true);
    try {
      final updated = _pickedImage != null
          ? await userService.updateMeWithPhoto(
              firstName: firstName,
              lastName: lastName,
              email: email,
              photoPath: _pickedImage!.path,
            )
          : await userService.updateMe(
              firstName: firstName,
              lastName: lastName,
              email: email,
            );
      await ref.read(authProvider.notifier).updateUser(updated);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('تم تحديث الملف الشخصي')),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: AppColors.white,
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
                  Text(
                    'تعديل الملف الشخصي',
                    style: AppTextStyles.h3
                        .copyWith(color: AppColors.darkText, fontSize: 20),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: const Icon(Icons.arrow_forward_ios_rounded,
                        size: 20, color: AppColors.darkText),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 24),
                child: Column(
                  children: [
                    // Avatar with pick
                    GestureDetector(
                      onTap: _pickImage,
                      child: Stack(
                        children: [
                          Container(
                            width: 136,
                            height: 136,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: AppColors.primary, width: 2.5),
                            ),
                            child: ClipOval(
                              child: _pickedImage != null
                                  ? Image.file(_pickedImage!,
                                      fit: BoxFit.cover)
                                  : _buildNetworkAvatar(user?.profilePicture,
                                      user?.firstName ?? ''),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              width: 34,
                              height: 34,
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                                border: Border.all(
                                    color: Colors.white, width: 2),
                              ),
                              child: const Icon(Icons.edit,
                                  color: Colors.white, size: 16),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),
                    Text(user?.fullName ?? '',
                        style: AppTextStyles.h3
                            .copyWith(color: AppColors.darkText)),
                    const SizedBox(height: 4),
                    Text(user?.email ?? '',
                        style: AppTextStyles.body
                            .copyWith(color: AppColors.darkText)),

                    const SizedBox(height: 32),

                    _buildField(
                      label: 'الاسم الكامل',
                      controller: _fullNameCtrl,
                      icon: Icons.person_outline,
                    ),
                    const SizedBox(height: 16),

                    _buildField(
                      label: 'البريد الإلكتروني',
                      controller: _emailCtrl,
                      icon: Icons.email_outlined,
                      keyboard: TextInputType.emailAddress,
                    ),

                    const SizedBox(height: 32),

                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _save,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20)),
                          elevation: 0,
                        ),
                        child: _loading
                            ? const SizedBox(
                                width: 22,
                                height: 22,
                                child: CircularProgressIndicator(
                                    color: Colors.white, strokeWidth: 2),
                              )
                            : const Text(
                                'حفظ التغييرات',
                                style: TextStyle(
                                  fontFamily: 'Rubik',
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
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

  Widget _buildNetworkAvatar(String? url, String firstName) {
    if (url != null && url.isNotEmpty) {
      return CachedNetworkImage(
        imageUrl: url,
        fit: BoxFit.cover,
        placeholder: (_, __) => _avatarPlaceholder(firstName),
        errorWidget: (_, __, ___) => _avatarPlaceholder(firstName),
      );
    }
    return _avatarPlaceholder(firstName);
  }

  Widget _avatarPlaceholder(String firstName) {
    return Container(
      color: AppColors.primary.withOpacity(0.15),
      child: Center(
        child: Text(
          firstName.isNotEmpty ? firstName[0].toUpperCase() : 'أ',
          style: AppTextStyles.h1.copyWith(
              color: AppColors.primary, fontSize: 48),
        ),
      ),
    );
  }

  Widget _buildField({
    required String label,
    required TextEditingController controller,
    required IconData icon,
    TextInputType keyboard = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(label,
            style: AppTextStyles.caption
                .copyWith(color: const Color(0xFF6B7280))),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: keyboard,
          textAlign: TextAlign.right,
          textDirection: TextDirection.rtl,
          decoration: InputDecoration(
            suffixIcon: Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Icon(icon, color: AppColors.primary, size: 22),
            ),
            contentPadding: const EdgeInsets.symmetric(
                horizontal: 20, vertical: 14),
            filled: true,
            fillColor: AppColors.white,
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
