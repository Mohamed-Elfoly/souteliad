const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
const ChatMessage = require('../models/chatMessageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

exports.sendMessage = catchAsync(async (req, res, next) => {
  const message = req.body.message || '';
  const imageFile = req.file || null;

  if (!message.trim() && !imageFile) {
    return next(new AppError('يجب إرسال رسالة أو صورة على الأقل', 400));
  }

  const imageUrl = imageFile ? `/uploads/chat/${imageFile.filename}` : null;

  // Save user message
  await ChatMessage.create({
    user: req.user.id,
    role: 'user',
    content: message.trim(),
    imageUrl,
  });

  // Fetch last 10 messages for context
  const history = await ChatMessage.find({ user: req.user.id })
    .sort('-createdAt')
    .limit(10)
    .lean();

  const chatHistory = history
    .reverse()
    .slice(0, -1)
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content || '(صورة)',
    }));

  // Build current user message content
  let userContent;

  if (imageFile) {
    const imageData = fs.readFileSync(imageFile.path);
    const base64Image = imageData.toString('base64');
    const mimeType = imageFile.mimetype || 'image/jpeg';

    userContent = [
      {
        type: 'image_url',
        image_url: {
          url: `data:${mimeType};base64,${base64Image}`,
        },
      },
      {
        type: 'text',
        text: message.trim() || 'ما هذه الإشارة؟ هل يمكنك تحليلها وشرحها؟',
      },
    ];
  } else {
    userContent = message.trim();
  }

  // Call Groq
  const completion = await groq.chat.completions.create({
    model: imageFile ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory,
      { role: 'user', content: userContent },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const aiResponse = completion.choices[0].message.content;

  const savedResponse = await ChatMessage.create({
    user: req.user.id,
    role: 'assistant',
    content: aiResponse,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      message: aiResponse,
      messageId: savedResponse._id,
    },
  });
});

exports.getHistory = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 50;

  const messages = await ChatMessage.find({ user: req.user.id })
    .sort('-createdAt')
    .limit(limit)
    .lean();

  return res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages: messages.reverse(),
    },
  });
});

exports.clearHistory = catchAsync(async (req, res, next) => {
  await ChatMessage.deleteMany({ user: req.user.id });

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
