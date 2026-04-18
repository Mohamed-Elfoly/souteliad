import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  extraFilters,
  placeholder = "بحث...",
}) {
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: "all", label: "الكل" },
    { value: "active", label: "نشط" },
    { value: "inactive", label: "معطل" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pr-9 pl-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8673a]/30 focus:border-[#e8673a] transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg flex-shrink-0">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusFilterChange(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                statusFilter === opt.value
                  ? "bg-white shadow text-[#e8673a]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Toggle */}
        {extraFilters && (
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              showFilters
                ? "bg-[#e8673a] text-white border-[#e8673a]"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#e8673a] hover:text-[#e8673a]"
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">فلاتر</span>
          </button>
        )}
      </div>

      {/* Extra Filters */}
      {showFilters && extraFilters && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {extraFilters}
        </div>
      )}
    </div>
  );
}