import MobileCard from "./MobileCard";
import EmptyState from "./EmptyState";

function MobileSkeletonCards() {
  return (
    <div className="p-3 flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
            <div className="h-7 w-14 bg-gray-200 rounded-lg" />
          </div>
          <div className="mt-3 flex gap-3">
            <div className="h-3 bg-gray-100 rounded w-20" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsMobileList({
  isLoading,
  filtered,
  paginated,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onViewReport,
}) {
  return (
    <div className="sm:hidden">
      {isLoading ? (
        <MobileSkeletonCards />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="p-3 flex flex-col gap-2.5">
          {/* Select-all bar */}
          <div className="flex items-center justify-between px-1 mb-0.5">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedIds.length === paginated.length && paginated.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-[#EB6837] rounded"
              />
              تحديد الكل
            </label>
            <span className="text-xs text-gray-400">{filtered.length} نتيجة</span>
          </div>

          {paginated.map((row, index) => (
            <MobileCard
              key={row.id || row._id || index}
              row={row}
              isSelected={selectedIds.includes(row.id || row._id)}
              onSelect={toggleSelect}
              onView={onViewReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}