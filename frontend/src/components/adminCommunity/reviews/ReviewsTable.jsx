import { Mail, BookOpen } from 'lucide-react';
import Avatar        from '../shared/Avatar';
import { timeAgo }  from '../shared/timeAgo';
import { StarRating, QualityBadge } from './ReviewsShared';
import { resolveUser, ratingLabel, REVIEWS_PER_PAGE } from './reviewHelpers';

export default function ReviewsTable({ ratings, page, onRowClick }) {
  return (
    <div className="hidden lg:block rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm text-right table-fixed">
        <colgroup>
          <col style={{ width: '5%'  }} />
          <col style={{ width: '24%' }} />
          <col style={{ width: '23%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '17%' }} />
        </colgroup>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">#</th>
            <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">الطالب</th>
            <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">الدرس</th>
            <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">التقييم</th>
            <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">الجودة</th>
            <th className="py-3.5 px-3 font-semibold text-gray-500 text-xs">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((r, idx) => {
            const { name, email } = resolveUser(r);
            const label           = ratingLabel(r.rating);
            return (
              <tr
                key={r._id ?? idx}
                onClick={() => onRowClick(r)}
                className="border-b border-gray-50 last:border-0 hover:bg-[#FFFAF5] transition-colors cursor-pointer"
              >
                <td className="py-3.5 px-3 text-gray-400 text-xs">
                  {(page - 1) * REVIEWS_PER_PAGE + idx + 1}
                </td>

                {/* Student */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={name} size="sm" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-semibold text-[#252C32] text-sm truncate">{name}</span>
                      {email && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 truncate" dir="ltr">
                          <Mail size={10} className="shrink-0" />
                          <span className="truncate">{email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Lesson */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <BookOpen size={13} className="text-[#EB6837] shrink-0" />
                    <span className="text-sm text-gray-600 truncate">
                      {r.lessonId?.title ?? '—'}
                    </span>
                  </div>
                </td>

                {/* Stars */}
                <td className="py-3.5 px-3">
                  <StarRating value={r.rating} />
                </td>

                {/* Quality */}
                <td className="py-3.5 px-3">
                  <QualityBadge label={label} />
                </td>

                {/* Date */}
                <td className="py-3.5 px-3 text-gray-400 text-xs whitespace-nowrap">
                  {timeAgo(r.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}