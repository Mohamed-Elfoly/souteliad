import { Trash2, Plus, ImageIcon } from "lucide-react";

export const Q_TYPES = [
  { value: "mcq", label: "اختيار متعدد" },
  { value: "true-false", label: "صح / خطأ" },
  { value: "ai-practice", label: "تدريب AI" },
];

export function makeQuestion() {
  return {
    id: crypto.randomUUID(),
    type: "mcq",
    text: "",
    marks: 1,
    imageUrl: "",
    expectedSign: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
  };
}

export default function QuestionCard({ q, idx, onChange, onDelete }) {
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
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              الإشارة المتوقعة{" "}
              <span className="text-gray-400">(الكلمة أو الحرف المطلوب)</span>
            </label>
            <input
              type="text"
              className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 bg-white"
              placeholder="مثال: مرحبا، أ، شكراً..."
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
          <input
            type="url"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
            placeholder="https://... أدخل رابط صورة السؤال"
            value={q.imageUrl || ""}
            onChange={(e) => onChange({ ...q, imageUrl: e.target.value })}
          />
          {q.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden max-h-32">
              <img
                src={q.imageUrl}
                alt="معاينة صورة السؤال"
                className="w-full object-contain max-h-32"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}