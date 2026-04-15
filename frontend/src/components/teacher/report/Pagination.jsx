import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null;

  const allPages     = Array.from({ length: totalPages }, (_, i) => i + 1);
  const dedupedPages = [
    ...new Set(
      allPages.filter(
        (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
      )
    ),
  ].sort((a, b) => a - b);

  const rangeStart = (currentPage - 1) * itemsPerPage + 1;
  const rangeEnd   = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-gray-100"
      dir="rtl"
    >
      <p className="text-xs text-gray-400 order-2 sm:order-1">
        عرض{" "}
        <span className="font-semibold text-gray-600">{rangeStart}–{rangeEnd}</span>{" "}
        من{" "}
        <span className="font-semibold text-gray-600">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} className="text-gray-500" />
        </button>

        {dedupedPages.map((p, i) => {
          const showEllipsis = i > 0 && p - dedupedPages[i - 1] > 1;
          return (
            <span key={p} className="inline-flex items-center gap-1">
              {showEllipsis && <span className="text-gray-300 text-xs px-0.5">…</span>}
              <button
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  p === currentPage
                    ? "bg-[#EB6837] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}