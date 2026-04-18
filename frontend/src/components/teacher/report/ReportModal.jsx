import { X } from "lucide-react";
import Stars from "./Stars";

export default function ReportModal({ report, onClose }) {
  if (!report) return null;

  const student = report.studentId || {};
  const teacher = report.teacherId || {};
  const date = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("ar-EG")
    : "—";

  const rows = [
    { label: "الطالب",  value: `${student.firstName || ""} ${student.lastName || ""}`.trim() || "—" },
    { label: "المعلم",  value: `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() || "—" },
    { label: "المستوى", value: report.level  || "—" },
    { label: "الدرس",   value: report.lesson || "—" },
    { label: "التاريخ", value: date },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl"
        style={{ animation: "modal-in 0.22s cubic-bezier(.34,1.3,.64,1) both" }}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">تفاصيل التقرير</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-red-50 transition-colors group"
          >
            <X size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-3">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-gray-400 shrink-0">{label}</span>
              <span className="text-sm text-gray-700 font-medium">{value}</span>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-gray-400 shrink-0">التقييم</span>
            <Stars count={report.rating} />
          </div>

          {report.notes && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mt-1">
              <p className="text-xs font-semibold text-[#EB6837] mb-1.5">الملاحظات</p>
              <p className="text-sm text-gray-600 leading-relaxed">{report.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}