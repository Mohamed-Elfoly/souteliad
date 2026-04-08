import { useState } from 'react';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts } from '../../api/postApi';
import Avatar from './shared/Avatar';
import StatusBadge from './shared/StatusBadge';
import Spinner from './shared/Spinner';
import EmptyState from './shared/EmptyState';
import Pagination from './shared/Pagination';
import { timeAgo } from './shared/timeAgo';
import { getUserName } from './shared/GetUserName';

const REVIEWS_PER_PAGE = 8;

export default function ReviewsTab() {
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page],
    queryFn:  () => getAllPosts({ page, limit: REVIEWS_PER_PAGE }),
  });

  const all   = data?.data?.data?.data ?? data?.data?.data ?? [];
  const total = data?.data?.results ?? all.length;
  const pages = Math.max(1, Math.ceil(total / REVIEWS_PER_PAGE));

  const filtered = search.trim()
    ? all.filter((r) => {
        const name    = getUserName(r);
        const content = r.content ?? r.text ?? '';
        const q       = search.toLowerCase();
        return name.toLowerCase().includes(q) || content.toLowerCase().includes(q);
      })
    : all;

  return (
    <div className="p-4 md:p-6">
      {/* Search bar */}
      <div className="relative max-w-sm mb-6">
        <input
          type="text"
          placeholder="ابحث عن اسم أو محتوى التقييم..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full py-2.5 pr-10 pl-4 rounded-full border border-gray-200 bg-white text-sm outline-none transition-all focus:border-[#EB6837] focus:ring-2 focus:ring-[#EB6837]/10"
          dir="rtl"
        />
        <Search
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState message="لا توجد بيانات" />
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm text-right" dir="rtl">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3.5 px-4 font-semibold text-gray-500 text-xs w-10">#</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-500 text-xs">الاسم</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-500 text-xs hidden md:table-cell">نوع التقييم</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-500 text-xs">الرسالة</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-500 text-xs">الحالة</th>
                  <th className="py-3.5 px-4 font-semibold text-gray-500 text-xs hidden lg:table-cell">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => {
                  const name = getUserName(r);
                  return (
                    <tr
                      key={r._id ?? r.id ?? idx}
                      className="border-b border-gray-50 last:border-0 hover:bg-[#FFFAF5] transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-400 text-xs">
                        {(page - 1) * REVIEWS_PER_PAGE + idx + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={name} size="sm" />
                          <span className="font-medium text-[#252C32] whitespace-nowrap text-sm">{name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-500 hidden md:table-cell">
                        {r.type ?? 'تقييم'}
                      </td>
                      <td className="py-4 px-4 text-gray-600 max-w-xs">
                        <p className="line-clamp-2 leading-relaxed text-sm">
                          {r.content ?? r.text ?? '—'}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={r.status ?? 'new'} />
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-xs hidden lg:table-cell whitespace-nowrap">
                        {timeAgo(r.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            current={page}
            total={pages}
            onChange={setPage}
            totalItems={total}
            perPage={REVIEWS_PER_PAGE}
          />
        </>
      )}
    </div>
  );
}