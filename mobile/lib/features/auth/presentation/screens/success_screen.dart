import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_routes.dart';

class SuccessScreen extends StatefulWidget {
  final String title;
  final String subtitle;
  final String? body;
  final String nextRoute;
  final bool isError;

  const SuccessScreen({
    super.key,
    required this.title,
    required this.subtitle,
    this.body,
    required this.nextRoute,
    this.isError = false,
  });

  @override
  State<SuccessScreen> createState() => _SuccessScreenState();
}

class _SuccessScreenState extends State<SuccessScreen> {
  @override
  void initState() {
    super.initState();
    if (!widget.isError) {
      Future.delayed(const Duration(milliseconds: 2500), () {
        if (mounted) context.go(widget.nextRoute);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Illustration card
              Container(
                width: double.infinity,
                height: 320,
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF0CF),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Center(
                  child: Icon(
                    widget.isError
                        ? Icons.error_outline_rounded
                        : Icons.check_circle_outline_rounded,
                    size: 120,
                    color: widget.isError
                        ? AppColors.textSecondary
                        : AppColors.primary,
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Title
              Text(
                widget.title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Rubik',
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF373D41),
                ),
              ),

              const SizedBox(height: 12),

              // Subtitle
              Text(
                widget.subtitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Rubik',
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF373D41),
                ),
              ),

              if (widget.body != null) ...[
                const SizedBox(height: 8),
                Text(
                  widget.body!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontFamily: 'Rubik',
                    fontSize: 14,
                    color: Color(0xFF868687),
                    height: 1.6,
                  ),
                ),
              ],

              const SizedBox(height: 32),

              // Button (error) or spinner (success)
              if (widget.isError)
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () => context.go(widget.nextRoute),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                    child: const Text(
                      'العودة للرئيسية',
                      style: TextStyle(
                        fontFamily: 'Rubik',
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: AppColors.white,
                      ),
                    ),
                  ),
                )
              else
                const SizedBox(
                  width: 32,
                  height: 32,
                  child: CircularProgressIndicator(
                    color: AppColors.primary,
                    strokeWidth: 2.5,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Helper to navigate to [SuccessScreen] with parameters.
void pushSuccess(
  BuildContext context, {
  required String title,
  required String subtitle,
  String? body,
  required String nextRoute,
}) {
  context.push(
    AppRoutes.authSuccess,
    extra: {
      'title': title,
      'subtitle': subtitle,
      'body': body,
      'nextRoute': nextRoute,
      'isError': false,
    },
  );
}

/// Helper to navigate to error screen.
void pushError(
  BuildContext context, {
  required String title,
  required String subtitle,
  String nextRoute = '/home',
}) {
  context.push(
    AppRoutes.authSuccess,
    extra: {
      'title': title,
      'subtitle': subtitle,
      'body': null,
      'nextRoute': nextRoute,
      'isError': true,
    },
  );
}
