const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatMessage = require('../models/chatMessageModel');
const Conversation = require('../models/conversationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Call Gemini for text/image/video
const askGemini = async ({ chatHistory, userText, imageFile, videoFile }) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // Build history as Gemini contents
  const contents = chatHistory.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Build current user turn (text + optional media)
  const parts = [];
  if (imageFile) {
    parts.push({
      inlineData: {
        mimeType: imageFile.mimetype || 'image/jpeg',
        data: imageFile.buffer.toString('base64'),
      },
    });
  }
  if (videoFile) {
    parts.push({
      inlineData: {
        mimeType: videoFile.mimetype || 'video/webm',
        data: videoFile.buffer.toString('base64'),
      },
    });
  }
  parts.push({
    text: userText || (videoFile
      ? 'شاهد الفيديو وحدد ما الإشارة التي قمت بها بلغة الإشارة العربية، ثم اشرحها لي بإيجاز.'
      : (imageFile ? 'ما هذه الإشارة؟ هل يمكنك تحليلها وشرحها؟' : '')),
  });

  contents.push({ role: 'user', parts });

  const result = await model.generateContent({ contents });
  return result.response.text();
};

// Fallback: Groq (text-only OR image)
const askGroq = async ({ chatHistory, userText, imageFile }) => {
  let userContent;
  if (imageFile) {
    const base64Image = imageFile.buffer.toString('base64');
    const mimeType = imageFile.mimetype || 'image/jpeg';
    userContent = [
      { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
      { type: 'text', text: userText || 'ما هذه الإشارة؟ هل يمكنك تحليلها وشرحها؟' },
    ];
  } else {
    userContent = userText;
  }

  const completion = await groq.chat.completions.create({
    model: imageFile ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content || '(صورة)',
      })),
      { role: 'user', content: userContent },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0].message.content;
};

const SYSTEM_PROMPT = `أنت مساعد ذكي متخصص لمنصة "صوت اليد" — منصة تعليمية عربية متخصصة في تعليم لغة الإشارة المصرية (Egyptian Sign Language / ESL).

═══════════════════════════════════════
 معلومات المنصة
═══════════════════════════════════════
- الاسم: صوت اليد
- الهدف: تعليم لغة الإشارة المصرية للصم وضعاف السمع وكل من يريد التواصل معهم
- المحتوى: دروس فيديو مقسمة على مستويات (مبتدئ → متوسط → متقدم)
- التقييم: اختبارات (كويزات) بعد كل درس لقياس مستوى الفهم
- الذكاء الاصطناعي: ميزة تدريب عبر الكاميرا لتحليل إشارات الطالب ومقارنتها بالإشارة الصحيحة
- المجتمع: منتدى داخلي للطلاب لتبادل التجارب والأسئلة
- تتبع التقدم: لوحة تحكم تظهر نسبة إتمام الدروس ودرجات الاختبارات
- المستخدمون: طلاب، معلمون، مشرفون

═══════════════════════════════════════
 تخصصك: لغة الإشارة المصرية
═══════════════════════════════════════
- أنت خبير في لغة الإشارة المصرية (Egyptian Sign Language)
- لغة الإشارة المصرية لغة بصرية-حركية مستقلة لها قواعدها النحوية الخاصة
- تختلف عن لغات الإشارة الأخرى (الأمريكية ASL، البريطانية BSL، إلخ)
- الإشارات تُشكَّل بحركات اليدين والوجه وتعبيرات الجسم
- الأبجدية الإشارية المصرية (Fingerspelling) تُستخدم للأسماء والكلمات الأجنبية
- لها مفردات خاصة بالسياق المصري واللهجة المحلية

═══════════════════════════════════════
 أسلوبك
═══════════════════════════════════════
- الإجابة دائماً بالعربية ما لم يكتب المستخدم بلغة أخرى
- أسلوب ودود ومشجع ومناسب للطلاب
- إجابات واضحة ومنظمة، استخدم قوائم ونقاط عند الحاجة
- إذا سُئلت عن إشارة معينة: اشرح شكل اليد + الحركة + أي تعبير وجه مطلوب
- لا تخترع إشارات غير موجودة — إذا لم تعرف قل ذلك بوضوح
- شجع الطالب دائماً على التدرب باستخدام ميزة الكاميرا في المنصة
- إذا أُرسلت صورة: حاول وصف ما تراه وربطه بلغة الإشارة المصرية`;

// ── Conversations ──

exports.getConversations = catchAsync(async (req, res) => {
  const conversations = await Conversation.find({ user: req.user.id })
    .sort('-updatedAt')
    .lean();

  return res.status(200).json({
    status: 'success',
    results: conversations.length,
    data: { conversations },
  });
});

exports.createConversation = catchAsync(async (req, res) => {
  const conversation = await Conversation.create({
    user: req.user.id,
    title: req.body.title || 'محادثة جديدة',
  });

  return res.status(201).json({
    status: 'success',
    data: { conversation },
  });
});

exports.deleteConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!conversation) return next(new AppError('المحادثة غير موجودة', 404));

  await ChatMessage.deleteMany({ conversationId: conversation._id });
  await conversation.deleteOne();

  return res.status(204).json({ status: 'success', data: null });
});

// ── Messages ──

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const message = req.body.message || '';
  const imageFile = req.files?.image?.[0] || null;
  const videoFile = req.files?.video?.[0] || null;

  if (!message.trim() && !imageFile && !videoFile) {
    return next(new AppError('يجب إرسال رسالة أو صورة أو فيديو على الأقل', 400));
  }

  // Verify conversation belongs to user
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: req.user.id,
  });
  if (!conversation) return next(new AppError('المحادثة غير موجودة', 404));

  let imageUrl = null;
  if (imageFile) {
    const { uploadImage } = require('../utils/cloudinary');
    imageUrl = await uploadImage(imageFile.buffer, 'chat');
  }

  // Save user message
  const userMessageContent = videoFile
    ? (message.trim() || '🎥 فيديو إشارة')
    : message.trim();

  await ChatMessage.create({
    user: req.user.id,
    conversationId,
    role: 'user',
    content: userMessageContent,
    imageUrl,
  });

  // Fetch last 10 messages for context
  const history = await ChatMessage.find({ conversationId })
    .sort('-createdAt')
    .limit(10)
    .lean();

  const chatHistory = history
    .reverse()
    .slice(0, -1);

  // Try Gemini first (handles text, image, AND video). Fall back to Groq if Gemini fails.
  let aiResponse;
  let usedFallback = false;
  try {
    aiResponse = await askGemini({
      chatHistory,
      userText: message.trim(),
      imageFile,
      videoFile,
    });
  } catch (err) {
    console.error('[chat] Gemini failed, falling back to Groq:', err.message);
    if (videoFile) {
      // Groq can't process video — return a friendly error
      aiResponse = 'عذراً، حدث خطأ أثناء تحليل الفيديو. حاول مرة أخرى.';
    } else {
      try {
        aiResponse = await askGroq({ chatHistory, userText: message.trim(), imageFile });
        usedFallback = true;
      } catch (err2) {
        aiResponse = 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
      }
    }
  }

  const savedResponse = await ChatMessage.create({
    user: req.user.id,
    conversationId,
    role: 'assistant',
    content: aiResponse,
  });

  // Update conversation title (from first user message) and updatedAt
  const updateData = { updatedAt: Date.now(), lastMessage: aiResponse.slice(0, 80) };
  if (conversation.title === 'محادثة جديدة') {
    const titleSource = message.trim()
      || (videoFile ? '🎥 فيديو إشارة' : (imageFile ? '🖼️ صورة إشارة' : ''));
    if (titleSource) updateData.title = titleSource.slice(0, 60);
  }
  await Conversation.findByIdAndUpdate(conversationId, updateData);

  return res.status(200).json({
    status: 'success',
    data: { message: aiResponse, messageId: savedResponse._id },
  });
});

exports.getHistory = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: req.user.id,
  });
  if (!conversation) return next(new AppError('المحادثة غير موجودة', 404));

  const messages = await ChatMessage.find({ conversationId })
    .sort('-createdAt')
    .limit(limit)
    .lean();

  return res.status(200).json({
    status: 'success',
    results: messages.length,
    data: { messages: messages.reverse() },
  });
});

exports.clearHistory = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: req.user.id,
  });
  if (!conversation) return next(new AppError('المحادثة غير موجودة', 404));

  await ChatMessage.deleteMany({ conversationId });
  await Conversation.findByIdAndUpdate(conversationId, { lastMessage: '', updatedAt: Date.now() });

  return res.status(204).json({ status: 'success', data: null });
});
