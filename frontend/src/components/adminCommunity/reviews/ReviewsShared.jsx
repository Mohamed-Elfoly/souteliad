import { Star } from 'lucide-react';

/** ── Star row with numeric label ── */
export function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13} fill={s <= value ? '#fbbf24' : '#e5e7eb'} strokeWidth={0} />
      ))}
      <span className="text-xs font-semibold text-gray-500 mr-1">{value}/5</span>
    </div>
  );
}

/** ── Stat summary card ── */
export function StatCard({ label, value, color, bg }) {
  return (
    <div
      className="flex flex-col gap-1 rounded-2xl px-3 py-3 border min-w-0"
      style={{ background: bg, borderColor: color + '33' }}
    >
      <span className="text-[11px] font-medium truncate" style={{ color }}>{label}</span>
      <span className="text-xl font-extrabold text-[#252C32]">{value ?? '—'}</span>
    </div>
  );
}

/** ── Quality badge pill ── */
export function QualityBadge({ label }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${label.cls}`}>
      {label.text}
    </span>
  );
}