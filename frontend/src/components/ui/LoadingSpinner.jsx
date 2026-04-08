export default function LoadingSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #EB6837',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
