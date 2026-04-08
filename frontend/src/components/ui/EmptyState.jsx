export default function EmptyState({
  title = 'لا توجد بيانات',
  description = '',
  action,
}) {
  return (
    <div className="empty-state">
      <svg
        className="empty-state-icon"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="60" r="56" fill="#FFF6EA" />
        <rect x="35" y="38" width="50" height="44" rx="6" stroke="#EB6837" strokeWidth="3" fill="none" />
        <path d="M45 54h30M45 63h20" stroke="#EB6837" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="78" cy="78" r="12" fill="#FFF6EA" stroke="#EB6837" strokeWidth="2.5" />
        <path d="M74 78h8M78 74v8" stroke="#EB6837" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <h3 className="empty-state-title">{title}</h3>

      {description && (
        <p className="empty-state-desc">{description}</p>
      )}

      {action && (
        <button className="empty-state-btn" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
