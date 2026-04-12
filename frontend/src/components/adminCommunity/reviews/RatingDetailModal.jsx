import { X, Mail, BookOpen, Clock, User, Star as StarIcon } from 'lucide-react';
import Avatar        from '../shared/Avatar';
import { timeAgo }  from '../shared/timeAgo';
import { StarRating, QualityBadge } from './ReviewsShared';
import { resolveUser, ratingLabel }  from './reviewHelpers';

const PRIMARY = '#EB6837';

/** Single info row inside the modal */
function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-[#FFF8F5] border border-[#FDE8DE] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[#EB6837]">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
        <div className="text-sm font-semibold text-[#252C32] break-words">{children}</div>
      </div>
    </div>
  );
}

export default function RatingDetailModal({ rating, onClose }) {
  if (!rating) return null;

  const { name, email } = resolveUser(rating);
  const label           = ratingLabel(rating.rating);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
        dir="rtl"
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #f0895e 100%)` }}
        >
          <div className="flex items-center gap-3">
            <Avatar name={name} size="md" />
            <div>
              <p className="text-white font-bold text-sm leading-tight">{name}</p>
              {email && (
                <p className="text-white/70 text-xs mt-0.5" dir="ltr">{email}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={16} color="#fff" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-5 space-y-4 overflow-y-auto max-h-[70vh]">

          {/* Rating highlight */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF8F5] border border-[#FDE8DE]">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">التقييم</span>
              <StarRating value={rating.rating} />
            </div>
            <QualityBadge label={label} />
          </div>

          {/* Info rows */}
          <div className="space-y-3.5">
            <InfoRow icon={<User size={14} />} label="الطالب">
              {name}
            </InfoRow>

            {email && (
              <InfoRow icon={<Mail size={14} />} label="البريد الإلكتروني">
                <span dir="ltr">{email}</span>
              </InfoRow>
            )}

            <InfoRow icon={<BookOpen size={14} />} label="الدرس">
              {rating.lessonId?.title ?? '—'}
            </InfoRow>

            <InfoRow icon={<Clock size={14} />} label="تاريخ التقييم">
              {timeAgo(rating.createdAt)}
            </InfoRow>

            {/* Full stars visual */}
            <InfoRow icon={<StarIcon size={14} />} label="النجوم">
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon
                    key={s}
                    size={20}
                    fill={s <= rating.rating ? '#fbbf24' : '#e5e7eb'}
                    strokeWidth={0}
                  />
                ))}
                <span className="text-base font-extrabold text-[#252C32] mr-2">
                  {rating.rating} / 5
                </span>
              </div>
            </InfoRow>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-5 pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}