import { Plus } from "lucide-react";
import QuestionCard, { makeQuestion } from "./QuestionCard";

/**
 * QuizCard
 * Handles: quiz enable toggle, quiz title input, question list management
 *
 * Props:
 *   quizEnabled, setQuizEnabled
 *   quizTitle, setQuizTitle
 *   questions, setQuestions
 */
export default function QuizCard({
  quizEnabled,
  setQuizEnabled,
  quizTitle,
  setQuizTitle,
  questions,
  setQuestions,
}) {
  const updateQuestion = (id, updated) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? updated : q)));

  const deleteQuestion = (id) =>
    setQuestions((qs) => qs.filter((q) => q.id !== id));

  const addQuestion = () =>
    setQuestions((qs) => [...qs, makeQuestion()]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Toggle header ── */}
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-semibold text-gray-700">إضافة اختبار للدرس</p>
          <p className="text-xs text-gray-400 mt-0.5">
            أضف أسئلة مباشرةً أثناء إنشاء الدرس
          </p>
        </div>
        <button
          type="button"
          aria-label="تفعيل الاختبار"
          onClick={() => setQuizEnabled((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            quizEnabled ? "bg-orange-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              quizEnabled ? "-translate-x-6" : "-translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* ── Quiz body (shown when enabled) ── */}
      {quizEnabled && (
        <div className="border-t border-gray-100 p-6 space-y-4">
          {/* Quiz title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              عنوان الاختبار
            </label>
            <input
              type="text"
              placeholder="مثال: اختبار الدرس الأول"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </div>

          {/* Question cards */}
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

          {/* Add question */}
          <button
            type="button"
            onClick={addQuestion}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-orange-200 text-orange-500 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all text-sm font-medium"
          >
            <Plus size={16} /> إضافة سؤال جديد
          </button>
        </div>
      )}
    </div>
  );
}