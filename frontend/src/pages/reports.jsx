import { useState } from "react";
import { Search } from "lucide-react";

import { useReports }         from "../hooks/useReports";
import ReportModal            from "../components/teacher/report/ReportModal";
import ReportsTable           from "../components/teacher/report/ReportsTable";
import ReportsMobileList      from "../components/teacher/report/ReportsMobileList";
import Pagination             from "../components/teacher/report/Pagination";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);

  const {
    search,
    currentPage,
    selectedIds,
    isLoading,
    filtered,
    paginated,
    totalPages,
    handleSearchChange,
    setCurrentPage,
    toggleSelect,
    toggleSelectAll,
    ITEMS_PER_PAGE,
  } = useReports();

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)      scale(1);   }
        }
      `}</style>

      <div className="w-full min-w-0" dir="rtl">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          تقارير الطلبة
        </h1>

        <div className="w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* ── Toolbar ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-gray-100">
            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="البحث باسم الطالب…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-9 rounded-xl border border-gray-200 bg-gray-50 pr-8 pl-9 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EB6837]/25 focus:border-[#EB6837] transition-all"
              />
            </div>

            {selectedIds.length > 0 && (
              <span className="self-start sm:self-auto text-xs font-semibold text-[#EB6837] bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                {selectedIds.length} محدد
              </span>
            )}
          </div>

          {/* ── Desktop table ────────────────────────────────────────────── */}
          <ReportsTable
            isLoading={isLoading}
            filtered={filtered}
            paginated={paginated}
            currentPage={currentPage}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
            onViewReport={setSelectedReport}
          />

          {/* ── Mobile card list ─────────────────────────────────────────── */}
          <ReportsMobileList
            isLoading={isLoading}
            filtered={filtered}
            paginated={paginated}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
            onViewReport={setSelectedReport}
          />

          {/* ── Pagination ───────────────────────────────────────────────── */}
          {!isLoading && filtered.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </div>
      </div>

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      <ReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </>
  );
}