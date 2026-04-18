import { X, User, Mail } from "lucide-react";
import { getStudentName } from "../../../hooks/useDashboard";

export default function NotificationModal({
  student,
  content,
  onContentChange,
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
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl"
        style={{ animation: "modal-enter 0.22s cubic-bezier(.34,1.3,.64,1) both" }}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">إرسال إشعار</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-red-50 transition-colors group"
          >
            <X size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Body */}
        <form className="flex flex-col gap-4 px-5 py-5" onSubmit={onSubmit}>
          {/* Full name — read-only */}
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

          {/* Email — read-only */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-500">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                value={student?.email || ""}
                readOnly
                className="w-full h-11 rounded-full border border-gray-200 bg-gray-50 pr-4 pl-10 text-sm text-gray-700 focus:outline-none"
              />
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Notification content */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-500">محتوى الإشعار</label>
            <textarea
              placeholder="أدخل محتوى الإشعار"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#EB6837]/25 focus:border-[#EB6837] transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-2xl bg-[#EB6837] hover:bg-[#d55a2b] active:scale-[0.98] text-white text-lg font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {isPending ? "جاري الإرسال..." : "إرسال"}
          </button>
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