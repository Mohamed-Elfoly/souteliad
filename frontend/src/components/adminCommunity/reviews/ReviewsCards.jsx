import { BookOpen, Clock } from 'lucide-react';
import Avatar       from '../shared/Avatar';
import { timeAgo } from '../shared/timeAgo';
import { StarRating, QualityBadge } from './ReviewsShared';
import { resolveUser, ratingLabel }  from './reviewHelpers';

export default function ReviewsCards({ ratings, onCardClick }) {
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {ratings.map((r, idx) => {
        const { name, email } = resolveUser(r);
        const label           = ratingLabel(r.rating);
        return (
          <div
            key={r._id ?? idx}
            onClick={() => onCardClick(r)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 cursor-pointer hover:bg-[#FFFAF5] transition-colors"
          >
            {/* Name + quality badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <Avatar name={name} size="sm" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-bold text-[#252C32] text-sm truncate">{name}</span>
                  {email && (
                    <span className="text-xs text-gray-400 truncate" dir="ltr">{email}</span>
                  )}
                </div>
              </div>
              <QualityBadge label={label} />
            </div>

            {/* Lesson */}
            <div className="flex items-center gap-1.5 text-xs">
              <BookOpen size={12} className="text-[#EB6837] shrink-0" />
              <span className="font-medium text-[#252C32] shrink-0">الدرس:</span>
              <span className="text-gray-500 truncate">{r.lessonId?.title ?? '—'}</span>
            </div>

            {/* Stars */}
            <StarRating value={r.rating} />

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {timeAgo(r.createdAt)}
            </div>
          </div>
        );
      })}
    </div>
  );
}