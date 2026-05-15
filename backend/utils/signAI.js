const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const SIGN_SERVICE_URL = process.env.SIGN_SERVICE_URL || 'http://localhost:8000';

// ─── KArSL/SwinV2 service (specialized letter recognition) ─────────────────
const tryKarslService = async (videoBuffer, expectedSign, mimeType) => {
  try {
    const formData = new FormData();
    const ext = mimeType?.includes('webm') ? 'webm' : 'mp4';
    const blob = new Blob([videoBuffer], { type: mimeType || 'video/mp4' });
    formData.append('video', blob, `sign.${ext}`);
    formData.append('expected', expectedSign);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${SIGN_SERVICE_URL}/predict`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return null;
    const data = await response.json();
    if (data.error) return null;

    const passed = data.matches || data.matches_top5;
    return {
      source: 'swinv2',
      detected: data.predicted,
      accuracy: Math.round(data.confidence * 100),
      passed,
      top5: data.top5,
    };
  } catch {
    return null;
  }
};

// ─── Type-specific Gemini prompts ──────────────────────────────────────────
const buildGeminiPrompt = (expectedSign, expectedType) => {
  const base = `أنت خبير في لغة الإشارة العربية. شاهد الفيديو وقيّم أداء الطالب.

الفيديو قد يكون معكوساً أفقياً (كاميرا selfie). الطالب مبتدئ — كن مشجعاً.`;

  const typeSpecific = {
    letter: `النوع: حرف عربي
الحرف المتوقع: "${expectedSign}"

ابحث عن إشارة يد ثابتة تمثل الحرف. الإشارات الصحيحة تشمل شكل اليد المعروف للحرف في لغة الإشارة العربية.`,

    number: `النوع: رقم عربي
الرقم المتوقع: "${expectedSign}"

ابحث عن إشارة يد تمثل الرقم. مثلاً: الرقم 1 إصبع السبابة، الرقم 5 الكف المفتوح كاملاً، الرقم 0 دائرة بالإبهام والسبابة. كن متساهلاً قليلاً مع التطابق.`,

    word: `النوع: كلمة
الكلمة المتوقعة: "${expectedSign}"

ابحث عن سلسلة من الإشارات أو إشارة واحدة تمثل الكلمة بأكملها. الكلمات في لغة الإشارة قد تكون إشارة واحدة كاملة (وليس تهجئة). إذا رأيت الطالب يؤدي إشارة تشير إلى معنى الكلمة، اعتبرها صحيحة.`,

    sentence: `النوع: جملة
الجملة المتوقعة: "${expectedSign}"

ابحث عن عدة إشارات متتالية على مدى الفيديو تشكل الجملة. لغة الإشارة لها قواعدها الخاصة، فالترتيب قد يختلف عن العربية المنطوقة. ركّز على وجود الإشارات الرئيسية للجملة.`,
  };

  return `${base}

${typeSpecific[expectedType] || typeSpecific.letter}

أجب فقط بصيغة JSON (بدون markdown أو نص إضافي):
{
  "detected": "<الإشارة التي تم اكتشافها بالعربية>",
  "matches_expected": <true إذا كانت تطابق المتوقع بشكل معقول>,
  "confidence": <رقم 0-100، كن سخياً مع المبتدئين>,
  "feedback_arabic": "<تعليق مشجع قصير بالعربية>"
}`;
};

const tryGemini = async (videoBuffer, expectedSign, expectedType, mimeType = 'video/mp4') => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = buildGeminiPrompt(expectedSign, expectedType);

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType, data: videoBuffer.toString('base64') } },
  ]);

  let text = result.response.text().trim();
  text = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(text);

  return {
    source: 'gemini',
    detected: parsed.detected,
    accuracy: Math.max(0, Math.min(100, parsed.confidence)),
    passed: parsed.matches_expected && parsed.confidence >= 60,
    feedback: parsed.feedback_arabic,
  };
};

// ─── Main entry ────────────────────────────────────────────────────────────
const analyzeSign = async (videoBuffer, expectedSign, mimeType, expectedType = 'letter') => {
  // Letters → try specialized SwinV2 first, fall back to Gemini
  if (expectedType === 'letter') {
    const karslResult = await tryKarslService(videoBuffer, expectedSign, mimeType);
    if (karslResult) {
      return {
        expectedSign,
        expectedType,
        detected: karslResult.detected,
        accuracy: karslResult.accuracy,
        passed: karslResult.passed,
        feedback: karslResult.passed
          ? `أحسنت! تم التعرف على الحرف "${karslResult.detected}" بنجاح.`
          : `حاول مرة أخرى. تم التعرف على "${karslResult.detected}" لكن المطلوب "${expectedSign}".`,
        source: karslResult.source,
        top5: karslResult.top5,
      };
    }
  }

  // Numbers, words, sentences → Gemini directly with type-specific prompt
  // (also letters if SwinV2 failed)
  try {
    const geminiResult = await tryGemini(videoBuffer, expectedSign, expectedType, mimeType);

    const typeLabels = {
      letter: 'الحرف',
      number: 'الرقم',
      word: 'الكلمة',
      sentence: 'الجملة',
    };
    const label = typeLabels[expectedType] || 'الإشارة';

    return {
      expectedSign,
      expectedType,
      detected: geminiResult.detected,
      accuracy: geminiResult.accuracy,
      passed: geminiResult.passed,
      feedback: geminiResult.feedback
        || (geminiResult.passed
          ? `أحسنت! ${label} صحيحة.`
          : `حاول مرة أخرى. المطلوب: "${expectedSign}"`),
      source: geminiResult.source,
    };
  } catch (err) {
    return {
      expectedSign,
      expectedType,
      accuracy: 0,
      passed: false,
      feedback: 'حدث خطأ أثناء تحليل الفيديو. يرجى المحاولة مرة أخرى.',
      source: 'error',
      error: err.message,
    };
  }
};

module.exports = { analyzeSign };
