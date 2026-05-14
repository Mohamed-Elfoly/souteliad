const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const SIGN_SERVICE_URL = process.env.SIGN_SERVICE_URL || 'http://localhost:8000';

// ─── KArSL BiLSTM service ──────────────────────────────────────────────────
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
      source: 'karsl-bilstm',
      detected: data.predicted,
      detectedEnglish: data.predicted_english,
      accuracy: Math.round(data.confidence * 100),
      passed,
      top5: data.top5,
    };
  } catch {
    return null;
  }
};

// ─── Gemini Vision fallback ────────────────────────────────────────────────
const tryGemini = async (videoBuffer, expectedSign, mimeType = 'video/mp4') => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are evaluating a student learning Arabic Sign Language.
Expected sign: "${expectedSign}"

The student's video may be horizontally mirrored. Be encouraging for beginners.
If you can see ANY recognizable hand gesture that could match "${expectedSign}", give confidence at least 65.

Respond ONLY in this JSON format:
{
  "detected": "<sign you saw in Arabic, or 'unclear'>",
  "matches_expected": <true if it could match, false only if clearly different>,
  "confidence": <0-100, be generous for beginners>,
  "feedback_arabic": "<short encouraging feedback in Arabic>"
}`;

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
const analyzeSign = async (videoBuffer, expectedSign, mimeType) => {
  // 1) Try KArSL BiLSTM (specialized Arabic Sign Language model)
  const karslResult = await tryKarslService(videoBuffer, expectedSign, mimeType);
  if (karslResult) {
    return {
      expectedSign,
      detected: karslResult.detected,
      accuracy: karslResult.accuracy,
      passed: karslResult.passed,
      feedback: karslResult.passed
        ? `أحسنت! تم التعرف على الإشارة "${karslResult.detected}" بنجاح.`
        : `حاول مرة أخرى. تم التعرف على "${karslResult.detected}" لكن المطلوب "${expectedSign}".`,
      source: karslResult.source,
      top5: karslResult.top5,
    };
  }

  // 2) Fall back to Gemini Vision (if Python service unavailable)
  try {
    const geminiResult = await tryGemini(videoBuffer, expectedSign, mimeType);
    return {
      expectedSign,
      detected: geminiResult.detected,
      accuracy: geminiResult.accuracy,
      passed: geminiResult.passed,
      feedback: geminiResult.feedback
        || (geminiResult.passed ? 'أحسنت!' : `حاول مرة أخرى. المطلوب: "${expectedSign}"`),
      source: geminiResult.source,
    };
  } catch (err) {
    return {
      expectedSign,
      accuracy: 0,
      passed: false,
      feedback: 'حدث خطأ أثناء تحليل الفيديو. يرجى المحاولة مرة أخرى.',
      source: 'error',
      error: err.message,
    };
  }
};

module.exports = { analyzeSign };
