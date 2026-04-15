import { X, User } from "lucide-react";
import { getStudentName } from "../../../hooks/useDashboard";

export default function WriteReportModal({
  student,
  levels,
  levelLessons,
  selectedLevelId,
  reportData,
  onLevelChange,
  onReportDataChange,
  onSubmit,
  onClose,
  isPending,
}) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92dvh] overflow-y-auto"
        style={{ animation: "modal-enter 0.22s cubic-bezier(.34,1.3,.64,1) both" }}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-800">كتابة تقرير التعلم</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-red-50 transition-colors group"
          >
            <X size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Body */}
        <form className="flex flex-col gap-4 px-5 py-5" onSubmit={onSubmit}>
          {/* Student name — read-only */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-500">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                value={getStudentName(student)}
                readOnly
                className="w-full h-11 rounded-full border border-gray-200 bg-gray-50 pr-4 pl-10 text-sm text-gray-700 focus:outline-none"
              />
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">المستوى</label>
            <select
              value={selectedLevelId}
              onChange={onLevelChange}
              className="w-full h-11 rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EB6837]/25 focus:border-[#EB6837] transition-all appearance-none"
            >
              <option value="">اختر المستوى</option>
              {levels.map((lvl) => (
                <option key={lvl._id || lvl.id} value={lvl._id || lvl.id}>
                  {lvl.title}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">الدرس</label>
            <select
              value={reportData.lesson}
              onChange={(e) => onReportDataChange({ lesson: e.target.value })}
              disabled={!selectedLevelId}
              className="w-full h-11 rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EB6837]/25 focus:border-[#EB6837] transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedLevelId ? "اختر الدرس" : "اختر المستوى أولاً"}
              </option>
              {levelLessons.map((les) => (
                <option key={les._id || les.id} value={les.title}>
                  {les.title}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">التقييم</label>
            <div className="flex gap-1 flex-row-reverse justify-end">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onReportDataChange({ rating: star })}
                  className="text-3xl p-0.5 transition-colors bg-transparent border-none cursor-pointer"
                  style={{
                    color: star <= reportData.rating ? "rgba(255,193,7,1)" : "#d1d5db",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">الملاحظات:</label>
            <textarea
              placeholder={"أحسنت 👏\nالطالب يتعرّف على الحروف والأرقام بلغة الإشارة بشكل جيد."}
              value={reportData.notes}
              onChange={(e) => onReportDataChange({ notes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#EB6837]/25 focus:border-[#EB6837] transition-all"
            />
          </div>

          {/* Action buttons — stacked on mobile, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl border border-[#EB6837] bg-white text-[#373D41] text-lg font-bold hover:bg-[#fef2f2] active:scale-[0.98] transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-12 rounded-2xl bg-[#EB6837] hover:bg-[#d55a2b] active:scale-[0.98] text-white text-lg font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "جاري الإرسال..." : "إرسال التقرير"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modal-enter {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}