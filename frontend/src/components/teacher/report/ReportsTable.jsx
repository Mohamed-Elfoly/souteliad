import Stars from "./Stars";
import SkeletonRows from "./SkeletonRows";
import EmptyState from "./EmptyState";

const ITEMS_PER_PAGE = 8;

export default function ReportsTable({
  isLoading,
  filtered,
  paginated,
  currentPage,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onViewReport,
}) {
  return (
    <div className="hidden sm:block w-full">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#D9DDE0] border-b border-gray-200">
            <th className="w-9 px-3 py-3">
              {!isLoading && (
                <input
                  type="checkbox"
                  checked={selectedIds.length === paginated.length && paginated.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-[#EB6837] rounded cursor-pointer"
                />
              )}
            </th>
            <th className="px-3 py-3 text-right text-sm font-semibold text-gray-600 w-8">#</th>
            <th className="px-3 py-3 text-right text-sm font-semibold text-gray-600">اسم الطالب</th>
            <th className="px-3 py-3 text-right text-sm font-semibold text-gray-600 whitespace-nowrap hidden lg:table-cell">المستوى</th>
            <th className="px-3 py-3 text-right text-sm font-semibold text-gray-600 whitespace-nowrap hidden md:table-cell">الدرس</th>
            <th className="px-3 py-3 text-right text-sm font-semibold text-gray-600 whitespace-nowrap hidden xl:table-cell">التقييم</th>
            <th className="px-3 py-3 text-right text-sm font-semibold text-gray-600 whitespace-nowrap hidden sm:table-cell">التاريخ</th>
            <th className="px-3 py-3 w-6 text-sm font-semibold text-gray-600 whitespace-nowrap">خيارات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <EmptyState />
              </td>
            </tr>
          ) : (
            paginated.map((row, index) => {
              const id         = row.id || row._id;
              const isSelected = selectedIds.includes(id);
              return (
                <tr
                  key={id || index}
                  className={`border-b border-[#D9DDE0] transition-colors hover:bg-gray-50 ${
                    isSelected ? "bg-orange-50/50" : ""
                  }`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(id)}
                      className="w-4 h-4 accent-[#EB6837] rounded cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-gray-400 font-medium">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-3 py-4 text-gray-800 font-medium text-sm">
                    {row.studentName || "—"}
                  </td>
                  <td className="px-3 py-4 text-gray-600 text-sm hidden lg:table-cell">
                    {row.level || "—"}
                  </td>
                  <td className="px-3 py-4 text-gray-600 text-sm hidden md:table-cell">
                    {row.lesson || "—"}
                  </td>
                  <td className="px-3 py-4 hidden xl:table-cell">
                    <Stars count={row.rating} />
                  </td>
                  <td className="px-3 py-4 text-gray-600 text-sm hidden sm:table-cell">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString("ar-EG") : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => onViewReport(row)}
                      className="px-4 py-2 text-sm font-semibold rounded-2xl bg-[#EB6837] text-white hover:bg-[#d55a2b] active:scale-95 transition-all shadow-sm shadow-orange-100 whitespace-nowrap"
                    >
                      عرض التقرير
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}