import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Trash2, ImageIcon, FileText, ChevronDown } from "lucide-react";
import { createQuiz, createQuestion } from "../../api/quizApi";
import { getAllLevels } from "../../api/levelApi";
import { getAllLessons } from "../../api/lessonApi";
import { createNotification } from "../../api/notificationApi";

// ── Question types ──
const Q_TYPES = [
  { value: "mcq", label: "اختيار متعدد" },
  { value: "true-false", label: "صح / خطأ" },
  { value: "ai-practice", label: "تدريب AI" },
];

function makeQuestion() {
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

function QuestionCard({ q, idx, onChange, onDelete }) {
  const handleTypeChange = (type) => {
    let options = q.options;
    if (type === "true-false") options = [{ text: "صح", isCorrect: true }, { text: "خطأ", isCorrect: false }];
    else if (type === "ai-practice") options = [];
    else if (q.type !== "mcq") options = [{ text: "", isCorrect: true }, { text: "", isCorrect: false }];
    onChange({ ...q, type, options });
  };

  const setCorrect = (i) => onChange({ ...q, options: q.options.map((o, oi) => ({ ...o, isCorrect: oi === i })) });
  const setOptionText = (i, text) => onChange({ ...q, options: q.options.map((o, oi) => oi === i ? { ...o, text } : o) });
  const addOption = () => onChange({ ...q, options: [...q.options, { text: "", isCorrect: false }] });
  const removeOption = (i) => {
    const options = q.options.filter((_, oi) => oi !== i);
    if (!options.some((o) => o.isCorrect) && options.length > 0) options[0].isCorrect = true;
    onChange({ ...q, options });
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
          السؤال {idx + 1}
        </span>
        <button type="button" onClick={onDelete} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <input
        type="text"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 mb-4 bg-gray-50"
        placeholder="اكتب نص السؤال هنا..."
        value={q.text}
        onChange={(e) => onChange({ ...q, text: e.target.value })}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {Q_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleTypeChange(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                q.type === t.value ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
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

      {q.type === "mcq" && (
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name={`correct-${q.id}`} checked={opt.isCorrect} onChange={() => setCorrect(i)} className="accent-orange-500" />
              <input
                type="text"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
                placeholder={`الخيار ${i + 1}`}
                value={opt.text}
                onChange={(e) => setOptionText(i, e.target.value)}
              />
              {q.options.length > 2 && (
                <button type="button" onClick={() => removeOption(i)} className="p-1.5 text-red-400 hover:text-red-600">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          {q.options.length < 6 && (
            <button type="button" onClick={addOption} className="flex items-center gap-1.5 text-orange-500 text-sm mt-2">
              <Plus size={14} /> إضافة خيار
            </button>
          )}
        </div>
      )}

      {q.type === "true-false" && (
        <div className="flex gap-3">
          {q.options.map((opt, i) => (
            <label
              key={i}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${opt.isCorrect ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500"}`}
            >
              <input type="radio" name={`correct-${q.id}`} checked={opt.isCorrect} onChange={() => setCorrect(i)} className="hidden" />
              <span className="font-medium text-sm">{opt.text}</span>
            </label>
          ))}
        </div>
      )}

      {q.type === "ai-practice" && (
        <div className="bg-purple-50 rounded-xl p-4 space-y-3">
          <p className="text-purple-600 text-sm">سيتم تقييم إجابة الطالب تلقائياً بواسطة الذكاء الاصطناعي</p>
          <div>
            <label className="block text-xs text-gray-500 mb-1">الإشارة المتوقعة</label>
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

      {(q.type === "mcq" || q.type === "true-false") && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <ImageIcon size={12} /> صورة السؤال <span className="text-gray-300">(اختياري)</span>
          </label>
          <input
            type="url"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
            placeholder="https://... رابط صورة السؤال"
            value={q.imageUrl || ""}
            onChange={(e) => onChange({ ...q, imageUrl: e.target.value })}
          />
          {q.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden max-h-32">
              <img src={q.imageUrl} alt="معاينة" className="w-full object-contain max-h-32" onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ──
export default function AddQuiz({ redirectTo = "/Dashboard" }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [quizTitle, setQuizTitle] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [questions, setQuestions] = useState([makeQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: levelsData } = useQuery({ queryKey: ["levels"], queryFn: getAllLevels });
  const levels = [...(levelsData?.data?.data?.data || [])].sort((a, b) => a.levelOrder - b.levelOrder);

  const { data: lessonsData } = useQuery({
    queryKey: ["lessons-for-quiz", selectedLevelId],
    queryFn: () => getAllLessons({ levelId: selectedLevelId, limit: 100 }),
    enabled: !!selectedLevelId,
  });
  const lessons = lessonsData?.data?.data?.data || [];

  const updateQuestion = (id, updated) => setQuestions((qs) => qs.map((q) => (q.id === id ? updated : q)));
  const deleteQuestion = (id) => setQuestions((qs) => qs.filter((q) => q.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizTitle.trim()) { toast.error("من فضلك أدخل عنوان الاختبار"); return; }
    if (!selectedLessonId) { toast.error("من فضلك اختر الدرس المرتبط بالاختبار"); return; }

    for (const q of questions) {
      if (!q.text.trim()) { toast.error("من فضلك أدخل نص كل سؤال"); return; }
      if (q.type === "mcq") {
        if (q.options.some((o) => !o.text.trim())) { toast.error("من فضلك أدخل نص كل خيار"); return; }
        if (!q.options.some((o) => o.isCorrect)) { toast.error("من فضلك حدد الإجابة الصحيحة لكل سؤال"); return; }
      }
      if (q.type === "ai-practice" && !q.expectedSign.trim()) { toast.error("من فضلك أدخل الإشارة المتوقعة"); return; }
    }

    setIsSubmitting(true);
    try {
      const quizRes = await createQuiz({ title: quizTitle, lessonId: selectedLessonId });
      const quizId = quizRes.data?.data?.data?._id ?? quizRes.data?.data?._id;

      if (quizId) {
        await Promise.all(
          questions.map((q) =>
            createQuestion(quizId, {
              questionText: q.text,
              questionType: q.type,
              marks: q.marks,
              options: q.type === "ai-practice" ? [] : q.options,
              ...(q.type === "ai-practice" && { expectedSign: q.expectedSign }),
              ...(q.imageUrl?.trim() && { imageUrl: q.imageUrl.trim() }),
            })
          )
        );
      }

      // 🔔 Notify students about the new quiz
      const lessonName = lessons.find((l) => (l._id || l.id) === selectedLessonId)?.title || "";
      try {
        await createNotification({
          type: "quiz",
          message: `تم إضافة اختبار جديد: ${quizTitle}${lessonName ? ` — للدرس: ${lessonName}` : ""}`,
        });
      } catch (_) { /* don't block flow */ }

      toast.success("تم حفظ الاختبار بنجاح");
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ في حفظ الاختبار");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-violet-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">إضافة أسئلة الاختبار</h1>
              <p className="text-sm text-gray-500">أنشئ اختباراً مرتبطاً بدرس معين</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Card: Quiz Info ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">معلومات الاختبار</h2>

            {/* Quiz title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان الاختبار</label>
              <input
                type="text"
                placeholder="مثال: اختبار الدرس الأول"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-gray-50"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>

            {/* Level select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المستوى</label>
              <div className="relative">
                <select
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 bg-gray-50"
                  value={selectedLevelId}
                  onChange={(e) => {
                    setSelectedLevelId(e.target.value);
                    setSelectedLessonId("");
                  }}
                >
                  <option value="">اختر المستوى</option>
                  {levels.map((lvl) => (
                    <option key={lvl._id || lvl.id} value={lvl._id || lvl.id}>{lvl.title}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Lesson select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                الدرس المرتبط بالاختبار <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 bg-gray-50 disabled:opacity-50"
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  disabled={!selectedLevelId}
                >
                  <option value="">{selectedLevelId ? "اختر الدرس" : "اختر المستوى أولاً"}</option>
                  {lessons.map((les) => (
                    <option key={les._id || les.id} value={les._id || les.id}>{les.title}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── Card: Questions ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">أسئلة الاختبار</h2>

            <div className="space-y-3">
              {questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  idx={i}
                  onChange={(updated) => updateQuestion(q.id, updated)}
                  onDelete={() => deleteQuestion(q.id)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setQuestions((qs) => [...qs, makeQuestion()])}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-violet-200 text-violet-500 rounded-xl hover:border-violet-400 hover:bg-violet-50 transition-all text-sm font-medium"
            >
              <Plus size={16} /> إضافة سؤال جديد
            </button>
          </div>

          {/* ── Buttons ── */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pb-6">
            <button
              type="button"
              onClick={() => navigate(redirectTo)}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-violet-500 text-white rounded-xl text-sm font-semibold hover:bg-violet-600 disabled:opacity-60 transition-colors shadow-sm"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ الاختبار"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}