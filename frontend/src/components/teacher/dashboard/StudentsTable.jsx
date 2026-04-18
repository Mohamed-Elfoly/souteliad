import { memo, useState } from "react";
import { Search, BookOpen, TrendingUp } from "lucide-react";
import Avatar from "../../ui/Avatar";
import { getStudentName } from "../../../hooks/useDashboard";

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null;
  return (
    <div
      className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-400"
      dir="rtl"
    >
      <span className="text-xs">
        أظهار {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}–
        {Math.min(currentPage * itemsPerPage, totalItems)} من {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-[#EB6837] text-white"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-7 shrink-0">{value}%</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[#EB6837] rounded-full transition-[width] duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-9 shrink-0 text-left">100%</span>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
        <Search size={22} className="text-gray-300" />
      </div>
      <p className="text-sm">لا توجد نتائج</p>
    </div>
  );
}

// ── Skeleton — table row ──────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 bg-gray-100 rounded-full animate-pulse"
            style={{ width: i === 2 ? "140px" : "60px" }}
          />
        </td>
      ))}
    </tr>
  );
}

// ── Skeleton — card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-100 rounded-full w-32" />
          <div className="h-3 bg-gray-100 rounded-full w-20" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-4/5" />
      </div>
    </div>
  );
}

// ── Student Card (mobile) ─────────────────────────────────────────────────────
function StudentCard({ student, index, isSelected, onToggle, onWriteReport, onSendNotif }) {
  const id = student._id || student.id;
  const name = getStudentName(student);

  return (
    <div
      dir="rtl"
      className={`relative bg-white rounded-2xl border transition-all duration-200 p-4 ${
        isSelected
          ? "border-[#EB6837]/40 bg-orange-50/30 shadow-sm"
          : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      {/* Top row: checkbox + number + avatar + name */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(id)}
          className="w-4 h-4 accent-[#EB6837] cursor-pointer rounded shrink-0"
        />
        <span className="text-xs text-gray-300 font-medium w-5 shrink-0">{index}</span>
        <Avatar
          src={student.profilePicture}
          name={name}
          iconSize={13}
          className="w-10 h-10 rounded-full shrink-0 text-sm"
        />
        <p className="flex-1 text-sm font-semibold text-gray-800 truncate">{name}</p>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-400">
            <BookOpen size={13} />
            <span className="text-xs">الدروس المكتملة</span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {student.completedLessons ?? 0}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-gray-400">
            <TrendingUp size={13} />
            <span className="text-xs">نسبة التقدم</span>
          </div>
          <ProgressBar value={student.progress || 0} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-50">
        <button
          onClick={() => onWriteReport?.(student)}
          className="flex-1 py-2 rounded-xl bg-orange-50 text-[#EB6837] text-xs font-semibold hover:bg-orange-100 active:scale-95 transition-all border-none cursor-pointer"
        >
          كتابة تقرير
        </button>
        <button
          onClick={() => onSendNotif?.(student)}
          className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 active:scale-95 transition-all border-none cursor-pointer"
        >
          ارسال اشعار
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function StudentsTable({ students = [], isLoading = false, onWriteReport, onSendNotif }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const ITEMS_PER_PAGE = 8;

  const filtered = students.filter((s) => {
    if (!search.trim()) return true;
    return getStudentName(s).toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allSelected =
    paginated.length > 0 && paginated.every((r) => selectedIds.includes(r._id || r.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(paginated.map((r) => r._id || r.id));
  };

  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      dir="rtl"
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="relative flex-1 max-w-xs">
            <Search
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="البحث عن طالب..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pr-8 pl-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EB6837]/20 focus:border-[#EB6837] transition-all"
          />
          
        </div>

        {selectedIds.length > 0 && (
          <span className="text-xs text-[#EB6837] font-medium bg-[#fef2f2] px-3 py-1 rounded-full shrink-0">
            {selectedIds.length} محدد
          </span>
        )}
      </div>

      {/* ══════════════════════════════════════
          DESKTOP  md+ → Table
      ══════════════════════════════════════ */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#D9DDE0] text-right">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-[#EB6837] cursor-pointer rounded"
                />
              </th>
              <th className="px-4 py-3 text-s font-semibold text-gray-400 w-10">#</th>
              <th className="px-4 py-3 text-s font-semibold text-gray-600">اسم الطالب</th>
              <th className="px-4 py-3 text-s font-semibold text-gray-600">الدروس المكتملة</th>
              <th className="px-4 py-3 text-s font-semibold text-gray-600 w-56">نسبة التقدم</th>
              <th className="px-4 py-3 text-s font-semibold text-gray-600">خيارات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState />
                </td>
              </tr>
            ) : (
              paginated.map((student, index) => {
                const id = student._id || student.id;
                const isSelected = selectedIds.includes(id);
                return (
                  <tr
                    key={id || index}
                    className={`border-b border-gray-50 transition-colors hover:bg-orange-50/30 ${
                      isSelected ? "bg-orange-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(id)}
                        className="w-4 h-4 accent-[#EB6837] cursor-pointer rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-center">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={student.profilePicture}
                          name={getStudentName(student)}
                          iconSize={13}
                          className="w-9 h-9 rounded-full shrink-0 text-sm"
                        />
                        <span className="font-medium text-gray-800">
                          {getStudentName(student)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {student.completedLessons ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar value={student.progress || 0} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onWriteReport?.(student)}
                          className="px-3 py-1.5 rounded-lg bg-orange-50 text-[#EB6837] text-xs font-semibold hover:bg-orange-100 active:scale-95 transition-all border-none cursor-pointer"
                        >
                          كتابة تقرير
                        </button>
                        <button
                          onClick={() => onSendNotif?.(student)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 active:scale-95 transition-all border-none cursor-pointer"
                        >
                          ارسال اشعار
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════
          MOBILE  < md → Cards
      ══════════════════════════════════════ */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center gap-2 px-4 pt-3 pb-1">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 accent-[#EB6837] cursor-pointer rounded"
              />
              <span className="text-xs text-gray-400">تحديد الكل</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
              {paginated.map((student, index) => {
                const id = student._id || student.id;
                return (
                  <StudentCard
                    key={id || index}
                    student={student}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    isSelected={selectedIds.includes(id)}
                    onToggle={toggleOne}
                    onWriteReport={onWriteReport}
                    onSendNotif={onSendNotif}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}

export default memo(StudentsTable);