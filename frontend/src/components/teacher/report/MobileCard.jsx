import Stars from "./Stars";

export default function MobileCard({ row, isSelected, onSelect, onView }) {
  const id   = row.id || row._id;
  const date = row.createdAt
    ? new Date(row.createdAt).toLocaleDateString("ar-EG")
    : "—";

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        isSelected ? "border-[#EB6837]/40 bg-orange-50/50" : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(id)}
            className="w-4 h-4 accent-[#EB6837] rounded shrink-0 cursor-pointer mt-0.5"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate">{row.studentName || "—"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{date}</p>
          </div>
        </div>
        <button
          onClick={() => onView(row)}
          className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#EB6837] text-white hover:bg-[#d55a2b] active:scale-95 transition-all"
        >
          عرض
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 pr-6">
        {row.level  && <span><span className="text-gray-400">المستوى: </span><span className="text-gray-700 font-medium">{row.level}</span></span>}
        {row.lesson && <span><span className="text-gray-400">الدرس: </span><span className="text-gray-700 font-medium">{row.lesson}</span></span>}
        <Stars count={row.rating} />
      </div>
    </div>
  );
}