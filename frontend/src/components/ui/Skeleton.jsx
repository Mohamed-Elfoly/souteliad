// Reusable skeleton loader — use instead of spinners for list/card content

function Skeleton({ width = '100%', height = '16px', borderRadius = '8px', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height="180px" borderRadius="12px" />
      <Skeleton height="20px" width="65%" style={{ marginTop: '14px' }} />
      <Skeleton height="15px" width="45%" style={{ marginTop: '8px' }} />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="15px"
          width={i === lines - 1 ? '55%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Skeleton width="48px" height="48px" borderRadius="50%" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton height="16px" width="60%" />
            <Skeleton height="13px" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
