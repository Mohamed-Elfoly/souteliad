// import { useState } from 'react';
// import { Search, ChevronDown, Star, BookOpen, Clock, Mail } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { getAllRatingsAdmin } from '../../../api/ratingApi';
// import { getUserName } from '../shared/GetUserName';
// import Avatar    from '../shared/Avatar';
// import Spinner   from '../shared/Spinner';
// import EmptyState from '../shared/EmptyState';
// import Pagination from '../shared/Pagination';
// import { timeAgo } from '../shared/timeAgo';

// const REVIEWS_PER_PAGE = 8;

// /* ─── Star display ─── */
// function StarRating({ value }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {[1, 2, 3, 4, 5].map((s) => (
//         <Star key={s} size={13} fill={s <= value ? '#fbbf24' : '#e5e7eb'} strokeWidth={0} />
//       ))}
//       <span className="text-xs font-semibold text-gray-500 mr-1">{value}/5</span>
//     </div>
//   );
// }

// /* ─── Stat card ─── */
// function StatCard({ label, value, color, bg }) {
//   return (
//     <div
//       className="flex flex-col gap-1 rounded-2xl px-3 py-3 border min-w-0"
//       style={{ background: bg, borderColor: color + '33' }}
//     >
//       <span className="text-[11px] font-medium truncate" style={{ color }}>{label}</span>
//       <span className="text-xl font-extrabold text-[#252C32]">{value ?? '—'}</span>
//     </div>
//   );
// }

// /* ─── Quality badge ─── */
// function ratingLabel(val) {
//   if (val >= 5) return { text: 'ممتاز',    cls: 'bg-green-50  text-green-600  border-green-100'  };
//   if (val >= 4) return { text: 'جيد جداً', cls: 'bg-blue-50   text-blue-600   border-blue-100'   };
//   if (val >= 3) return { text: 'جيد',      cls: 'bg-amber-50  text-amber-600  border-amber-100'  };
//   return              { text: 'ضعيف',     cls: 'bg-red-50    text-red-600    border-red-100'    };
// }

// /**
//  * Resolve name + email from a rating record.
//  *
//  * The backend populates userId with { firstName, lastName, email }.
//  * getUserName already handles this shape via obj.userId — we just
//  * pass the whole rating object straight to it.
//  *
//  * If populate didn't run (userId is still a bare string), we fall
//  * back to any top-level name fields on the rating doc itself.
//  */
// function resolveUser(r) {
//   const name = getUserName(r);   // handles obj.userId, obj.user, obj.firstName/lastName

//   // extract email from the same nested shape
//   const person = r.userId ?? r.user ?? null;
//   const email =
//     (person && typeof person === 'object' ? person.email : null) ??
//     r.email ??
//     '';

//   return { name, email };
// }

// const RATING_OPTIONS = [
//   { value: '',  label: 'كل التقييمات'    },
//   { value: '5', label: '5 نجوم ⭐⭐⭐⭐⭐' },
//   { value: '4', label: '4 نجوم ⭐⭐⭐⭐'  },
//   { value: '3', label: '3 نجوم ⭐⭐⭐'   },
//   { value: '2', label: '2 نجوم ⭐⭐'    },
//   { value: '1', label: '1 نجمة ⭐'      },
// ];

// /* ════════════════════════════════════════════════════════ */
// export default function ReviewsTab() {
//   const [page,         setPage]         = useState(1);
//   const [search,       setSearch]       = useState('');
//   const [ratingFilter, setRatingFilter] = useState('');

//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-ratings', page],
//     queryFn:  () => getAllRatingsAdmin({ page, limit: REVIEWS_PER_PAGE }),
//   });

//   /*
//    * Unwrap the axios response.
//    * Controller returns: { status, results, data: { data: [...] } }
//    * Axios wraps it:     response.data = { status, results, data: { data: [...] } }
//    * So:  data           = axios response object
//    *      data.data       = { status, results, data: { data: [...] } }
//    *      data.data.data  = { data: [...] }
//    *      data.data.data.data = [...]  ← the actual array
//    */
//   const raw   = data?.data?.data?.data ?? data?.data?.data ?? [];
//   const total = data?.data?.results    ?? raw.length;
//   const pages = Math.max(1, Math.ceil(total / REVIEWS_PER_PAGE));

//   // DEV helper — log the first record so you can inspect the actual shape
//   if (process.env.NODE_ENV !== 'production' && raw.length > 0) {
//     console.log('[ReviewsTab] sample rating record:', raw[0]);
//     console.log('[ReviewsTab] userId field:', raw[0]?.userId);
//     console.log('[ReviewsTab] resolved name:', getUserName(raw[0]));
//   }

//   /* client-side filter */
//   const filtered = raw.filter((r) => {
//     const { name } = resolveUser(r);
//     const lesson   = (r.lessonId?.title ?? '').toLowerCase();
//     const q        = search.toLowerCase().trim();
//     const matchQ    = !q || name.toLowerCase().includes(q) || lesson.includes(q);
//     const matchStar = !ratingFilter || r.rating === Number(ratingFilter);
//     return matchQ && matchStar;
//   });

//   /* stats */
//   const avg5   = raw.filter((r) => r.rating === 5).length;
//   const avgVal = raw.length
//     ? (raw.reduce((s, r) => s + (r.rating ?? 0), 0) / raw.length).toFixed(1)
//     : '—';

//   return (
//     <div className="w-full overflow-hidden p-4 md:p-6" dir="rtl">

//       {/* ── Stats ── */}
//       <div className="grid grid-cols-3 gap-2 mb-5">
//         <StatCard label="إجمالي التقييمات" value={total}  color="#EB6837" bg="#FFF8F5" />
//         <StatCard label="تقييم 5 نجوم"      value={avg5}   color="#F59E0B" bg="#FFFBEB" />
//         <StatCard label="متوسط التقييم"     value={avgVal} color="#10B981" bg="#ECFDF5" />
//       </div>

//       {/* ── Filters ── */}
//       <div className="flex items-center gap-2 mb-5 w-full">
//         <div className="relative flex-1 min-w-0">
//           <input
//             type="text"
//             placeholder="ابحث بالاسم أو الدرس..."
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//             className="w-full py-2.5 pr-9 pl-3 rounded-full border border-gray-200 bg-white text-sm outline-none focus:border-[#EB6837] focus:ring-2 focus:ring-[#EB6837]/10"
//           />
//           <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//         </div>

//         <div className="relative shrink-0">
//           <select
//             value={ratingFilter}
//             onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
//             className="appearance-none pr-3 pl-6 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-600 outline-none cursor-pointer focus:border-[#EB6837]"
//           >
//             {RATING_OPTIONS.map((o) => (
//               <option key={o.value} value={o.value}>{o.label}</option>
//             ))}
//           </select>
//           <ChevronDown size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//         </div>
//       </div>

//       {/* ── Content ── */}
//       {isLoading ? (
//         <Spinner />
//       ) : filtered.length === 0 ? (
//         <EmptyState message="لا توجد تقييمات" />
//       ) : (
//         <>
//           {/* Desktop table — lg+ */}
//           <div className="hidden lg:block rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//             <table className="w-full text-sm text-right table-fixed">
//               <colgroup>
//                 <col style={{ width: '5%'  }} />
//                 <col style={{ width: '24%' }} />
//                 <col style={{ width: '24%' }} />
//                 <col style={{ width: '17%' }} />
//                 <col style={{ width: '14%' }} />
//                 <col style={{ width: '16%' }} />
//               </colgroup>
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-100">
//                   <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">#</th>
//                   <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">الطالب</th>
//                   <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">الدرس</th>
//                   <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">التقييم</th>
//                   <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">الجودة</th>
//                   <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">التاريخ</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((r, idx) => {
//                   const { name, email } = resolveUser(r);
//                   const label = ratingLabel(r.rating);
//                   return (
//                     <tr
//                       key={r._id ?? idx}
//                       className="border-b border-gray-50 last:border-0 hover:bg-[#FFFAF5] transition-colors"
//                     >
//                       <td className="py-3.5 px-3 text-gray-400 text-xs">
//                         {(page - 1) * REVIEWS_PER_PAGE + idx + 1}
//                       </td>

//                       {/* Student */}
//                       <td className="py-3.5 px-3">
//                         <div className="flex items-center gap-2 min-w-0">
//                           <Avatar name={name} size="sm" />
//                           <div className="flex flex-col gap-0.5 min-w-0">
//                             <span className="font-semibold text-[#252C32] text-sm truncate">{name}</span>
//                             {email && (
//                               <span className="text-xs text-gray-400 flex items-center gap-1 truncate" dir="ltr">
//                                 <Mail size={10} className="shrink-0" />
//                                 <span className="truncate">{email}</span>
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </td>

//                       {/* Lesson */}
//                       <td className="py-3.5 px-3">
//                         <div className="flex items-center gap-1.5 min-w-0">
//                           <BookOpen size={13} className="text-[#EB6837] shrink-0" />
//                           <span className="text-sm text-gray-600 truncate">
//                             {r.lessonId?.title ?? '—'}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Stars */}
//                       <td className="py-3.5 px-3">
//                         <StarRating value={r.rating} />
//                       </td>

//                       {/* Quality */}
//                       <td className="py-3.5 px-3">
//                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${label.cls}`}>
//                           {label.text}
//                         </span>
//                       </td>

//                       {/* Date */}
//                       <td className="py-3.5 px-3 text-gray-400 text-xs whitespace-nowrap">
//                         {timeAgo(r.createdAt)}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile cards — below lg */}
//           <div className="flex flex-col gap-3 lg:hidden">
//             {filtered.map((r, idx) => {
//               const { name, email } = resolveUser(r);
//               const label = ratingLabel(r.rating);
//               return (
//                 <div
//                   key={r._id ?? idx}
//                   className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="flex items-center gap-2.5 min-w-0 flex-1">
//                       <Avatar name={name} size="sm" />
//                       <div className="flex flex-col gap-0.5 min-w-0">
//                         <span className="font-bold text-[#252C32] text-sm truncate">{name}</span>
//                         {email && (
//                           <span className="text-xs text-gray-400 truncate" dir="ltr">{email}</span>
//                         )}
//                       </div>
//                     </div>
//                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${label.cls}`}>
//                       {label.text}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1.5 text-xs">
//                     <BookOpen size={12} className="text-[#EB6837] shrink-0" />
//                     <span className="font-medium text-[#252C32] shrink-0">الدرس:</span>
//                     <span className="text-gray-500 truncate">{r.lessonId?.title ?? '—'}</span>
//                   </div>

//                   <StarRating value={r.rating} />

//                   <div className="flex items-center gap-1 text-xs text-gray-400">
//                     <Clock size={11} />
//                     {timeAgo(r.createdAt)}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <Pagination
//             current={page}
//             total={pages}
//             onChange={setPage}
//             totalItems={total}
//             perPage={REVIEWS_PER_PAGE}
//           />
//         </>
//       )}
//     </div>
//   );
// }



import { useState }      from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useQuery }       from '@tanstack/react-query';
import { getAllRatingsAdmin } from '../../../api/ratingApi';
import Spinner            from '../shared/Spinner';
import EmptyState         from '../shared/EmptyState';
import Pagination         from '../shared/Pagination';
import { StatCard }       from './ReviewsShared';
import ReviewsTable       from './ReviewsTable';
import ReviewsCards       from './ReviewsCards';
import RatingDetailModal  from './RatingDetailModal';
import { REVIEWS_PER_PAGE } from './reviewHelpers';

const RATING_OPTIONS = [
  { value: '',  label: 'كل التقييمات'    },
  { value: '5', label: '5 نجوم ⭐⭐⭐⭐⭐' },
  { value: '4', label: '4 نجوم ⭐⭐⭐⭐'  },
  { value: '3', label: '3 نجوم ⭐⭐⭐'   },
  { value: '2', label: '2 نجوم ⭐⭐'    },
  { value: '1', label: '1 نجمة ⭐'      },
];

export default function ReviewsTab() {
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [selected,     setSelected]     = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ratings', page],
    queryFn:  () => getAllRatingsAdmin({ page, limit: REVIEWS_PER_PAGE }),
  });

  const raw   = data?.data?.data?.data ?? data?.data?.data ?? [];
  const total = data?.data?.results    ?? raw.length;
  const pages = Math.max(1, Math.ceil(total / REVIEWS_PER_PAGE));

  /* client-side filter */
  const filtered = raw.filter((r) => {
    const q         = search.toLowerCase().trim();
    const lesson    = (r.lessonId?.title ?? '').toLowerCase();
    const person    = r.userId ?? r.user ?? r;
    const name      = typeof person === 'object'
      ? `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim().toLowerCase()
      : '';
    const matchQ    = !q || name.includes(q) || lesson.includes(q);
    const matchStar = !ratingFilter || r.rating === Number(ratingFilter);
    return matchQ && matchStar;
  });

  /* stats */
  const avg5   = raw.filter((r) => r.rating === 5).length;
  const avgVal = raw.length
    ? (raw.reduce((s, r) => s + (r.rating ?? 0), 0) / raw.length).toFixed(1)
    : '—';

  return (
    <div className="w-full overflow-hidden p-4 md:p-6" dir="rtl">

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <StatCard label="إجمالي التقييمات" value={total}  color="#EB6837" bg="#FFF8F5" />
        <StatCard label="تقييم 5 نجوم"      value={avg5}   color="#F59E0B" bg="#FFFBEB" />
        <StatCard label="متوسط التقييم"     value={avgVal} color="#10B981" bg="#ECFDF5" />
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-2 mb-5 w-full">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            placeholder="ابحث بالاسم أو الدرس..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full py-2.5 pr-9 pl-3 rounded-full border border-gray-200 bg-white text-sm outline-none focus:border-[#EB6837] focus:ring-2 focus:ring-[#EB6837]/10"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative shrink-0">
          <select
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
            className="appearance-none pr-3 pl-6 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-600 outline-none cursor-pointer focus:border-[#EB6837]"
          >
            {RATING_OPTIONS.map((o) => (
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
        <EmptyState message="لا توجد تقييمات" />
      ) : (
        <>
          <ReviewsTable
            ratings={filtered}
            page={page}
            onRowClick={setSelected}
          />

          <ReviewsCards
            ratings={filtered}
            onCardClick={setSelected}
          />

          <Pagination
            current={page}
            total={pages}
            onChange={setPage}
            totalItems={total}
            perPage={REVIEWS_PER_PAGE}
          />
        </>
      )}

      {/* ── Detail modal ── */}
      {selected && (
        <RatingDetailModal
          rating={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}