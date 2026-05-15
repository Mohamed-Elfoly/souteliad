import { Trash2, Plus, ImageIcon, Upload, X } from "lucide-react";
import { useRef } from "react";

export const Q_TYPES = [
  { value: "mcq", label: "اختيار متعدد" },
  { value: "true-false", label: "صح / خطأ" },
  { value: "ai-practice", label: "تدريب AI" },
];

export const EXPECTED_TYPES = [
  { value: "letter", label: "حرف", placeholder: "مثال: أ، ب، ت..." },
  { value: "number", label: "رقم", placeholder: "مثال: 1، 5، 100..." },
  { value: "word", label: "كلمة", placeholder: "مثال: مرحبا، شكراً..." },
  { value: "sentence", label: "جملة", placeholder: "مثال: كيف حالك؟" },
];

export function makeQuestion() {
  return {
    id: crypto.randomUUID(),
    type: "mcq",
    text: "",
    marks: 1,
    imageUrl: "",
    expectedSign: "",
    expectedType: "letter",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
  };
}

export default function QuestionCard({ q, idx, onChange, onDelete }) {
  const fileInputRef = useRef(null);

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ ...q, imageUrl: ev.target.result });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleTypeChange = (type) => {
    let options = q.options;
    if (type === "true-false")
      options = [{ text: "صح", isCorrect: true }, { text: "خطأ", isCorrect: false }];
    else if (type === "ai-practice")
      options = [];
    else if (q.type !== "mcq")
      options = [{ text: "", isCorrect: true }, { text: "", isCorrect: false }];
    onChange({ ...q, type, options });
  };

  const setCorrect = (i) =>
    onChange({ ...q, options: q.options.map((o, oi) => ({ ...o, isCorrect: oi === i })) });

  const setOptionText = (i, text) =>
    onChange({ ...q, options: q.options.map((o, oi) => (oi === i ? { ...o, text } : o)) });

  const addOption = () =>
    onChange({ ...q, options: [...q.options, { text: "", isCorrect: false }] });

  const removeOption = (i) => {
    const options = q.options.filter((_, oi) => oi !== i);
    if (!options.some((o) => o.isCorrect) && options.length > 0) options[0].isCorrect = true;
    onChange({ ...q, options });
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#EB6837] bg-orange-50 px-3 py-1 rounded-full">
          السؤال {idx + 1}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* ── Question text ── */}
      <input
        type="text"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 mb-4 bg-gray-50"
        placeholder="اكتب نص السؤال هنا..."
        value={q.text}
        onChange={(e) => onChange({ ...q, text: e.target.value })}
      />

      {/* ── Type tabs + marks ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {Q_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleTypeChange(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                q.type === t.value
                  ? "bg-white text-[#EB6837] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap">الدرجة</label>
          <input
            type="number"
            min="1"
            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-orange-400"
            value={q.marks}
            onChange={(e) => onChange({ ...q, marks: Math.max(1, Number(e.target.value) || 1) })}
          />
        </div>
      </div>

      {/* ── MCQ options ── */}
      {q.type === "mcq" && (
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${q.id}`}
                checked={opt.isCorrect}
                onChange={() => setCorrect(i)}
                className="accent-orange-500"
                title="الإجابة الصحيحة"
              />
              <input
                type="text"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
                placeholder={`الخيار ${i + 1}`}
                value={opt.text}
                onChange={(e) => setOptionText(i, e.target.value)}
              />
              {q.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          {q.options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-1.5 text-[#EB6837] hover:text-orange-600 text-sm mt-2"
            >
              <Plus size={14} /> إضافة خيار
            </button>
          )}
        </div>
      )}

      {/* ── True / False ── */}
      {q.type === "true-false" && (
        <div className="flex gap-3">
          {q.options.map((opt, i) => (
            <label
              key={i}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                opt.isCorrect
                  ? "border-[#EB6837] bg-[orange-50] text-[#EB6837]"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              <input
                type="radio"
                name={`correct-${q.id}`}
                checked={opt.isCorrect}
                onChange={() => setCorrect(i)}
                className="hidden"
              />
              <span className="font-medium text-sm">{opt.text}</span>
            </label>
          ))}
        </div>
      )}

      {/* ── AI Practice ── */}
      {q.type === "ai-practice" && (
        <div className="bg-purple-50 rounded-xl p-4 space-y-3">
          <p className="text-purple-600 text-sm">
            سيتم تقييم إجابة الطالب تلقائياً بواسطة الذكاء الاصطناعي
          </p>

          {/* Expected type selector */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">نوع الإشارة المتوقعة</label>
            <div className="flex gap-1.5 bg-white p-1 rounded-lg border border-purple-200">
              {EXPECTED_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChange({ ...q, expectedType: t.value, expectedSign: "" })}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    (q.expectedType || "letter") === t.value
                      ? "bg-purple-500 text-white shadow-sm"
                      : "text-gray-500 hover:bg-purple-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expected sign input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              الإشارة المتوقعة{" "}
              <span className="text-gray-400">(القيمة المطلوبة)</span>
            </label>
            <input
              type="text"
              className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 bg-white"
              placeholder={
                EXPECTED_TYPES.find((t) => t.value === (q.expectedType || "letter"))?.placeholder
                || "مثال: أ، 1، مرحبا..."
              }
              value={q.expectedSign}
              onChange={(e) => onChange({ ...q, expectedSign: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* ── Question image (MCQ & T/F only) ── */}
      {(q.type === "mcq" || q.type === "true-false") && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <ImageIcon size={12} /> صورة السؤال{" "}
            <span className="text-gray-300">(اختياري)</span>
          </label>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
              placeholder="https://... أدخل رابط صورة السؤال"
              value={q.imageUrl?.startsWith("data:") ? "" : (q.imageUrl || "")}
              onChange={(e) => onChange({ ...q, imageUrl: e.target.value })}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-orange-300 text-orange-400 text-xs hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              <Upload size={13} /> رفع صورة
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageFile}
            />
          </div>

          {q.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden relative">
              <img
                src={q.imageUrl}
                alt="معاينة صورة السؤال"
                className="w-full object-contain max-h-32"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <button
                type="button"
                onClick={() => onChange({ ...q, imageUrl: "" })}
                className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
              >
                <X size={11} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}