import { memo } from 'react';
import { Star, UserRound, Clock } from 'lucide-react';

function CourseCard({
  image,
  title,
  description,
  rating,
  level,
  duration,
  onAction,
  actionLabel = 'تعلم الآن',
}) {
  return (
    <div className="course-card">
      <img src={image} alt={title} loading="lazy" decoding="async" />
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="card-info">
        {rating && (
          <p>
            <Star size={18} color="#FFC107" /> {rating}
          </p>
        )}
        {level && (
          <p>
            <UserRound size={18} color="#EB6837" />
            {level}
          </p>
        )}
        {duration && (
          <p className="text">
            <Clock size={18} color="#EB6837" />
            {duration}
          </p>
        )}
      </div>
      {onAction && <button onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

export default memo(CourseCard);
