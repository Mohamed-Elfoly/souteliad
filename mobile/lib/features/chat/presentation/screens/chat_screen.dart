import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';

class _ChatMessage {
  final String text;
  final bool isUser;
  final DateTime time;
  const _ChatMessage(
      {required this.text, required this.isUser, required this.time});
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  bool _hasStarted = false;
  bool _showAttachMenu = false;
  bool _isTyping = false;
  final List<_ChatMessage> _messages = [];
  final TextEditingController _inputCtrl = TextEditingController();
  final ScrollController _scrollCtrl = ScrollController();

  @override
  void dispose() {
    _inputCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    final text = _inputCtrl.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(
          _ChatMessage(text: text, isUser: true, time: DateTime.now()));
      _inputCtrl.clear();
      _isTyping = true;
      _showAttachMenu = false;
    });
    _scrollToBottom();

    // Simulate AI response after 1.5s
    await Future.delayed(const Duration(milliseconds: 1500));
    if (!mounted) return;
    setState(() {
      _isTyping = false;
      _messages.add(_ChatMessage(
        text:
            'شكرًا على سؤالك! هذه الميزة ستكون متاحة قريبًا مع مساعد ذكاء اصطناعي متخصص في لغة الإشارة. 🤟',
        isUser: false,
        time: DateTime.now(),
      ));
    });
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context),
            Expanded(
              child: _hasStarted ? _buildChat() : _buildIntro(),
            ),
            if (_hasStarted) _buildInputBar(),
          ],
        ),
      ),
    );
  }

  // ── Header ───────────────────────────────────────────────────────────────

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Row(
        children: [
          // Hamburger / back — LTR left
          GestureDetector(
            onTap: () => context.pop(),
            child: const Icon(Icons.menu_rounded,
                color: AppColors.primary, size: 24),
          ),
          // Title center
          Expanded(
            child: Text(
              'صوت اليد',
              textAlign: TextAlign.center,
              style: AppTextStyles.h3.copyWith(
                color: const Color(0xFF373D41),
                fontWeight: FontWeight.w500,
                fontSize: 20,
              ),
            ),
          ),
          // Back arrow — LTR right
          GestureDetector(
            onTap: () => context.pop(),
            child: const Icon(Icons.arrow_forward_ios_rounded,
                color: AppColors.primary, size: 18),
          ),
        ],
      ),
    );
  }

  // ── Intro state ───────────────────────────────────────────────────────────

  Widget _buildIntro() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Directionality(
              textDirection: TextDirection.rtl,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const SizedBox(height: 32),
                  // Title
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: Text(
                      'مرحبًا بك في دردشة صوت اليد',
                      textAlign: TextAlign.right,
                      style: AppTextStyles.h2.copyWith(
                        color: const Color(0xFF373D41),
                        fontWeight: FontWeight.w700,
                        fontSize: 24,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: Text(
                      'المساعد الذكي اللي هيساعدك تتعلم لغة الإشارة خطوة بخطوة، وتسأل عن أي إشارة أو درس بسهولة.',
                      textAlign: TextAlign.right,
                      style: AppTextStyles.body.copyWith(
                        color: const Color(0xFF555555),
                        fontSize: 16,
                        height: 1.6,
                      ),
                    ),
                  ),
                  const SizedBox(height: 48),
                  // Info item 1
                  _IntroItem(
                    icon: Icons.flag_outlined,
                    title: 'قد تكون الردود غير دقيقة أحيانًا',
                    body:
                        'المساعد بيحاول يقدّم أفضل تفسير…\nلكن بعض الإشارات أو التفاصيل قد تحتاج مراجعة من مدرب متخصص.',
                  ),
                  const SizedBox(height: 28),
                  // Info item 2
                  _IntroItem(
                    icon: Icons.lock_outline_rounded,
                    title: 'احفظ خصوصيتك',
                    body:
                        'اتجنب مشاركة بيانات شخصية أو معلومات حساسة.\nهدفنا إن تجربتك تكون آمنة وواضحة.',
                  ),
                  const SizedBox(height: 48),
                ],
              ),
            ),
          ),
        ),
        // CTA button
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
          child: SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () => setState(() => _hasStarted = true),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20)),
                elevation: 0,
              ),
              child: const Text(
                'ابدأ الدردشة',
                style: TextStyle(
                  fontFamily: 'Rubik',
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ── Chat state ────────────────────────────────────────────────────────────

  Widget _buildChat() {
    return GestureDetector(
      onTap: () {
        if (_showAttachMenu) setState(() => _showAttachMenu = false);
        FocusScope.of(context).unfocus();
      },
      child: Stack(
        children: [
          _messages.isEmpty ? _buildEmptyChat() : _buildMessagesList(),
          if (_showAttachMenu) _buildAttachMenu(),
        ],
      ),
    );
  }

  Widget _buildEmptyChat() {
    return Center(
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Mascot placeholder
              Container(
                width: 160,
                height: 160,
                decoration: const BoxDecoration(
                  color: Color(0xFFFFF0CF),
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Icon(Icons.sign_language_rounded,
                      size: 72, color: AppColors.primary),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'مرحبًا بك في مساعد صوت اليد.',
                textAlign: TextAlign.center,
                style: AppTextStyles.h2.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 24,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'اسأل عن أي إشارة… وتعلّم فورًا',
                textAlign: TextAlign.center,
                style: AppTextStyles.h3.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 20,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'اكتب سؤالك أو فعّل الكاميرا أو أرسل صورة،\nوسأساعدك في تفسير الإشارة، شرحها، أو التدريب عليها بطريقة بسيطة وسريعة.',
                textAlign: TextAlign.center,
                style: AppTextStyles.body.copyWith(
                  color: const Color(0xFF555555),
                  fontSize: 16,
                  height: 1.6,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMessagesList() {
    return ListView.builder(
      controller: _scrollCtrl,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      itemCount: _messages.length + (_isTyping ? 1 : 0),
      itemBuilder: (_, i) {
        if (i == _messages.length && _isTyping) {
          return _TypingBubble();
        }
        return _MessageBubble(message: _messages[i]);
      },
    );
  }

  Widget _buildAttachMenu() {
    return Positioned(
      bottom: 0,
      right: 16,
      child: Container(
        width: 200,
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: const Color(0xFFDDDEDF)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 8,
              offset: const Offset(0, -2),
            )
          ],
        ),
        child: Directionality(
          textDirection: TextDirection.rtl,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _AttachOption(
                icon: Icons.camera_alt_outlined,
                label: 'كاميرا',
                onTap: () => setState(() => _showAttachMenu = false),
                showDivider: true,
              ),
              _AttachOption(
                icon: Icons.image_outlined,
                label: 'صور',
                onTap: () => setState(() => _showAttachMenu = false),
                showDivider: false,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Input bar ─────────────────────────────────────────────────────────────

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: Color(0xFFEEEEEE))),
      ),
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: Container(
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFDDDEDF)),
          ),
          child: Row(
            children: [
              // Send icon (RTL: right side)
              IconButton(
                icon: const Icon(Icons.send_rounded,
                    color: AppColors.primary, size: 22),
                onPressed: _sendMessage,
                padding: const EdgeInsets.symmetric(horizontal: 8),
                constraints: const BoxConstraints(),
              ),
              // Text field
              Expanded(
                child: TextField(
                  controller: _inputCtrl,
                  textAlign: TextAlign.right,
                  textDirection: TextDirection.rtl,
                  style: AppTextStyles.body.copyWith(fontSize: 16),
                  decoration: InputDecoration(
                    hintText: 'أسأل، التقط، أو أرسل صورة...',
                    hintTextDirection: TextDirection.rtl,
                    hintStyle: AppTextStyles.body.copyWith(
                      color: const Color(0xFF999999),
                      fontSize: 16,
                    ),
                    border: InputBorder.none,
                    isDense: true,
                    contentPadding:
                        const EdgeInsets.symmetric(vertical: 12),
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
              // Attach / add icon (RTL: left side)
              IconButton(
                icon: const Icon(Icons.add_circle_outline_rounded,
                    color: AppColors.primary, size: 22),
                onPressed: () =>
                    setState(() => _showAttachMenu = !_showAttachMenu),
                padding: const EdgeInsets.symmetric(horizontal: 8),
                constraints: const BoxConstraints(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Reusable widgets ──────────────────────────────────────────────────────────

class _IntroItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String body;
  const _IntroItem(
      {required this.icon, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Text(
              title,
              style: AppTextStyles.h3.copyWith(
                fontWeight: FontWeight.w600,
                fontSize: 18,
              ),
            ),
            const SizedBox(width: 8),
            Icon(icon, size: 24, color: AppColors.textPrimary),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          body,
          textAlign: TextAlign.right,
          style: AppTextStyles.body.copyWith(
            color: const Color(0xFF555555),
            fontSize: 16,
            height: 1.6,
          ),
        ),
      ],
    );
  }
}

class _MessageBubble extends StatelessWidget {
  final _ChatMessage message;
  const _MessageBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    final isUser = message.isUser;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isUser) ...[
            Container(
              width: 32,
              height: 32,
              margin: const EdgeInsets.only(right: 8),
              decoration: const BoxDecoration(
                color: Color(0xFFFFF0CF),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.sign_language_rounded,
                  size: 18, color: AppColors.primary),
            ),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isUser
                    ? AppColors.primary
                    : const Color(0xFFF5F6F7),
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 16),
                ),
              ),
              child: Text(
                message.text,
                textAlign: TextAlign.right,
                textDirection: TextDirection.rtl,
                style: AppTextStyles.body.copyWith(
                  color: isUser ? Colors.white : const Color(0xFF373D41),
                  fontSize: 15,
                  height: 1.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TypingBubble extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            margin: const EdgeInsets.only(right: 8),
            decoration: const BoxDecoration(
              color: Color(0xFFFFF0CF),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.sign_language_rounded,
                size: 18, color: AppColors.primary),
          ),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFF5F6F7),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const SizedBox(
              width: 36,
              height: 10,
              child: _DotsIndicator(),
            ),
          ),
        ],
      ),
    );
  }
}

class _DotsIndicator extends StatefulWidget {
  const _DotsIndicator();

  @override
  State<_DotsIndicator> createState() => _DotsIndicatorState();
}

class _DotsIndicatorState extends State<_DotsIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (_, __) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: List.generate(3, (i) {
            final delay = i / 3;
            final t = (_ctrl.value - delay).clamp(0.0, 1.0);
            final opacity = (t < 0.5 ? t * 2 : (1 - t) * 2).clamp(0.3, 1.0);
            return Opacity(
              opacity: opacity,
              child: Container(
                width: 7,
                height: 7,
                decoration: const BoxDecoration(
                  color: AppColors.textSecondary,
                  shape: BoxShape.circle,
                ),
              ),
            );
          }),
        );
      },
    );
  }
}

class _AttachOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool showDivider;

  const _AttachOption({
    required this.icon,
    required this.label,
    required this.onTap,
    required this.showDivider,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(
                horizontal: 12, vertical: 14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  label,
                  style: AppTextStyles.body.copyWith(
                    color: const Color(0xFF868687),
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(width: 8),
                Icon(icon,
                    color: const Color(0xFF868687), size: 22),
              ],
            ),
          ),
        ),
        if (showDivider)
          const Divider(height: 1, color: Color(0xFFD1D5DB)),
      ],
    );
  }
}
