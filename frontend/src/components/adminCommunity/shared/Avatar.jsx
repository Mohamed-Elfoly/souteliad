import { memo } from 'react';

const PRIMARY = '#EB6837';

const Avatar = memo(function Avatar({ name, src, size = 'md' }) {
  const sz =
    size === 'sm' ? 'w-8 h-8 text-xs'
    : size === 'lg' ? 'w-12 h-12 text-lg'
    : 'w-10 h-10 text-sm';

  // Always produce a visible character — fall back to '?' if name is empty/undefined
  const safeName = (typeof name === 'string' && name.trim()) ? name.trim() : '?';
  const initial  = safeName.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={safeName}
        className={`${sz} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: PRIMARY }}
    >
      {initial}
    </div>
  );
});

export default Avatar;