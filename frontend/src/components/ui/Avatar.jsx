import { UserRound } from 'lucide-react';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  src,
  alt = 'user',
  className = '',
  iconSize = 56,
  iconColor = '#EB6837',
  name = '',
  level = 0,          // ← الباراميتر الجديد (0 إلى 3)
}) {
  // /uploads/* paths are proxied by Vite to the backend — no prefix needed
  const resolvedSrc = src && src !== 'default.jpg' ? src : null;

  // تحديد كلاس المستوى لتغيير لون الـ border
  const levelClass = level >= 0 && level <= 3 ? `avatar-level-${level}` : 'avatar-level-0';

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        className={`avatar-img ${levelClass} ${className}`}
        style={{ 
          width: iconSize * 1.4, 
          height: iconSize * 1.4 
        }}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling?.removeAttribute('style');
        }}
      />
    );
  }

  const initials = getInitials(name);

  if (initials) {
    return (
      <div
        className={`avatar-initials ${levelClass} ${className}`}
        style={{ 
          width: iconSize * 1.4, 
          height: iconSize * 1.4, 
          fontSize: iconSize * 0.55 
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`avatar-placeholder ${levelClass} ${className}`}>
      <UserRound size={iconSize} strokeWidth={1.5} color={iconColor} />
    </div>
  );
}