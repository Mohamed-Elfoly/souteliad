import { useState } from 'react';
import {
  Search, ChevronDown,Send,
  MessageSquare, Clock, Mail, Tag,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllTickets } from '../../../api/supportApi';
import ReplyDrawer from './TicketDetailsModal';
import StatusBadge from '../shared/StatusBadge';
import Spinner     from '../shared/Spinner';
import EmptyState  from '../shared/EmptyState';
import Pagination  from '../shared/Pagination';
import { timeAgo } from '../shared/timeAgo';

const TICKETS_PER_PAGE = 8;
const PRIMARY = '#EB6837';

const STATUS_OPTIONS = [
  { value: '',         label: 'جميع الحالات' },
  { value: 'new',      label: 'جديدة'        },
  { value: 'resolved', label: 'تم الحل'      },
];

/* ─── Stat card ─── */
function StatCard({ label, value, color, bg }) {
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

/* ─── Main component ─── */
export default function SupportTicketsTab() {
  const [page,           setPage]           = useState(1);
  const [search,         setSearch]         = useState('');
  const [status,         setStatus]         = useState('');
  const [selected,       setSelected]       = useState(null);
  const [localOverrides, setLocalOverrides] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tickets', page, status],
    queryFn:  () => getAllTickets({ page, limit: TICKETS_PER_PAGE, ...(status && { status }) }),
  });

  const raw   = data?.data?.data?.data ?? data?.data?.data ?? [];
  const total = data?.data?.results ?? raw.length;
  const pages = Math.max(1, Math.ceil(total / TICKETS_PER_PAGE));

  const all = raw.map((t) =>
    localOverrides[t._id] ? { ...t, ...localOverrides[t._id] } : t
  );

  const filtered = search.trim()
    ? all.filter((t) => {
        const q = search.toLowerCase();
        return (
          (t.fullName ?? '').toLowerCase().includes(q) ||
          (t.email    ?? '').toLowerCase().includes(q) ||
          (t.reason   ?? '').toLowerCase().includes(q) ||
          (t.message  ?? '').toLowerCase().includes(q)
        );
      })
    : all;

  const newCount      = all.filter((t) => t.status === 'new').length;
  const resolvedCount = all.filter((t) => t.status === 'resolved').length;

  const handleReplied = (id, replyText) => {
    setLocalOverrides((prev) => ({
      ...prev,
      [id]: { status: 'resolved', adminReply: replyText },
    }));
  };

  return (
    /* KEY FIX: w-full + overflow-hidden so nothing bleeds outside the parent */
    <div className="w-full overflow-hidden p-4 md:p-6" dir="rtl">

      {/* ── Stats: 3 equal columns, text truncates if narrow ── */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <StatCard label="إجمالي التذاكر" value={total}         color="#EB6837" bg="#FFF8F5" />
        <StatCard label="جديدة"           value={newCount}      color="#3B82F6" bg="#EFF6FF" />
        <StatCard label="تم الحل"         value={resolvedCount} color="#10B981" bg="#ECFDF5" />
      </div>

      {/* ── Filters: single row, search fills space, select shrinks ── */}
      <div className="flex items-center gap-2 mb-5 w-full">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            placeholder="ابحث بالاسم أو السبب..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full py-2.5 pr-9 pl-3 rounded-full border border-gray-200 bg-white text-sm outline-none focus:border-[#EB6837] focus:ring-2 focus:ring-[#EB6837]/10"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Status select */}
        <div className="relative shrink-0">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="appearance-none pr-3 pl-6 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-600 outline-none cursor-pointer focus:border-[#EB6837]"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState message="لا توجد تذاكر دعم" icon={MessageSquare} />
      ) : (
        <>
          {/*
            TABLE — only at lg (1024px+) where there is enough room for 7 cols.
            Everything below lg uses the card layout.
          */}
          <div className="hidden lg:block rounded-2xl  shadow-sm overflow-hidden ">
            <table className="w-full text-sm text-right table-fixed">
              <colgroup>
                <col style={{ width: '6%'  }} />  {/* # */}
                <col style={{ width: '22%' }} />  {/* المستخدم */}
                <col style={{ width: '14%' }} />  {/* السبب */}
                <col style={{ width: '25%' }} />  {/* الرسالة */}
                
                <col style={{ width: '12%' }} />  {/* التاريخ */}
                <col style={{ width: '10%'  }} />  {/* إجراء */}
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">#</th>
                  <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">المستخدم</th>
                  <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">السبب</th>
                  <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">الرسالة</th>
                  
                  <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">التاريخ</th>
                  <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket, idx) => {
                  const name =
                    ticket.fullName ||
                    [ticket.userId?.firstName, ticket.userId?.lastName].filter(Boolean).join(' ') ||
                    'مجهول';
                  const resolved = ticket.status === 'resolved';
                  return (
                    <tr
                      onClick={() => setSelected(ticket)}
                      key={ticket._id ?? idx}
                      className="border-b border-gray-50 last:border-0 hover:bg-[#FFFAF5] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-3 text-gray-400 text-xs">
                        {(page - 1) * TICKETS_PER_PAGE + idx + 1}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-semibold text-[#252C32] text-sm truncate">{name}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 truncate" dir="ltr">
                            <Mail size={10} className="shrink-0" />
                            <span className="truncate">{ticket.email}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-gray-600">
                        <p className="line-clamp-2 text-sm">{ticket.reason}</p>
                      </td>
                      <td className="py-3.5 px-3 text-gray-500">
                        <p className="line-clamp-2 text-sm leading-relaxed">{ticket.message}</p>
                      </td>
                      
                      <td className="py-3.5 px-3 text-gray-400 text-xs whitespace-nowrap">
                        {timeAgo(ticket.createdAt)}
                      </td>
                      <td className="py-3.5 px-3">
                        {resolved ? (
                          <span className="text-xs text-gray-400 italic">تم الرد</span>
                        ) : (
                          <button
                            onClick={() => setSelected(ticket)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                            style={{ background: PRIMARY }}
                          >
                            <Send size={11} />
                            رد
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* CARDS — shown below lg (< 1024px) */}
          <div className="flex flex-col gap-3 lg:hidden">
            {filtered.map((ticket, idx) => {
              const name =
                ticket.fullName ||
                [ticket.userId?.firstName, ticket.userId?.lastName].filter(Boolean).join(' ') ||
                'مجهول';
              const resolved = ticket.status === 'resolved';
              return (
                <div
                  key={ticket._id ?? idx}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3"
                >
                  {/* Name + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="font-bold text-[#252C32] text-sm truncate">{name}</span>
                      <span className="text-xs text-gray-400 truncate" dir="ltr">{ticket.email}</span>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={ticket.status ?? 'new'} />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="flex items-start gap-1.5 text-xs">
                    <Tag size={12} className="text-[#EB6837] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#252C32] shrink-0">السبب:</span>
                    <span className="text-gray-500 break-words">{ticket.reason}</span>
                  </div>

                  {/* Message */}
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 bg-gray-50 rounded-xl px-3 py-2">
                    {ticket.message}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                      <Clock size={11} />
                      {timeAgo(ticket.createdAt)}
                    </span>
                    {resolved ? (
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 shrink-0">
                        ✓ تم الرد
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelected(ticket)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shrink-0"
                        style={{ background: PRIMARY }}
                      >
                        <Send size={11} />
                        رد على المستخدم
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            current={page}
            total={pages}
            onChange={setPage}
            totalItems={total}
            perPage={TICKETS_PER_PAGE}
          />
        </>
      )}

      {selected && (
        <ReplyDrawer
          ticket={selected}
          onClose={() => setSelected(null)}
          onReplied={handleReplied}
        />
      )}
    </div>
  );
}