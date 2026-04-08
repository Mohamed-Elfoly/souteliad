const PRIMARY = '#EB6837';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="w-9 h-9 rounded-full border-4 border-orange-100 animate-spin"
        style={{ borderTopColor: PRIMARY }}
      />
    </div>
  );
}