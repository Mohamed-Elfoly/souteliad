import { ChevronRight, ChevronLeft } from 'lucide-react';

const PRIMARY = '#EB6837';

function PagBtn({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all
        ${active
          ? 'text-white shadow-sm'
          : 'border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed'
        }`}
      style={active ? { background: PRIMARY, borderColor: PRIMARY } : {}}
    >
      {children}
    </button>
  );
}

export default function Pagination({ current, total, onChange, totalItems, perPage }) {
  if (total <= 1) return null;

  const from  = (current - 1) * perPage + 1;
  const to    = Math.min(current * perPage, totalItems);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => start + i).filter(
    (p) => p >= 1 && p <= total
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-5 px-1">
      <p className="text-xs text-gray-400">
        {from}–{to} من {totalItems}
      </p>
      <div className="flex items-center gap-1.5">
        <PagBtn onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}>
          <ChevronRight size={14} />
        </PagBtn>
        {pages.map((p) => (
          <PagBtn key={p} onClick={() => onChange(p)} active={p === current}>
            {p}
          </PagBtn>
        ))}
        <PagBtn onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}>
          <ChevronLeft size={14} />
        </PagBtn>
      </div>
    </div>
  );
}