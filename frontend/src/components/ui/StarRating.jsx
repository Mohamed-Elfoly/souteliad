export default function StarRating({ value, onChange, max = 5 }) {
  return (
    <div className="rating-container">
      {Array.from({ length: max }, (_, i) => max - i).map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= value ? 'active' : ''}`}
          onClick={() => onChange?.(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
