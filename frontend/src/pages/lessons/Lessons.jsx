import { useState } from "react";
import letters from "../../assets/images/letters.png";
import family from "../../assets/images/family.png";
import home from "../../assets/images/home.png";
import food from "../../assets/images/food.png";
import one from "../../assets/images/one.png";
import two from "../../assets/images/two.png";
import three from "../../assets/images/three.png";
import four from "../../assets/images/four.png";
import lessonpage from "../../assets/images/lessonpage.png";
import { Star, UserRound, Clock, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/lesson.css";
import { useQuery } from "@tanstack/react-query";
import { getAllLevels, getLevelLessons } from "../../api/levelApi";
import { getMyProgress } from "../../api/lessonApi";
import useAuth from "../../hooks/useAuth";

const LEVEL_IMAGES = [one, two, three, four];
const FALLBACK_THUMBS = [letters, family, home, food];

function StarDisplay({ rating }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className="star-display">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          color="#FFC107"
          fill={s <= rounded ? "#FFC107" : "none"}
        />
      ))}
      {rating > 0 && (
        <span className="star-display-value">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}

export default function Lessons() {
  const location = useLocation();
  const [activeLevelId, setActiveLevelId] = useState(location.state?.levelId ?? null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: levelsData } = useQuery({
    queryKey: ["levels"],
    queryFn: getAllLevels,
  });

  const levels = levelsData?.data?.data?.data || [];
  const sortedLevels = [...levels].sort((a, b) => a.levelOrder - b.levelOrder);
  const effectiveLevelId = activeLevelId ?? sortedLevels[0]?._id;

  const { data: lessonsData, isLoading } = useQuery({
    queryKey: ["level-lessons", effectiveLevelId],
    queryFn: () => getLevelLessons(effectiveLevelId),
    enabled: !!effectiveLevelId,
  });

  const { data: progressData } = useQuery({
    queryKey: ["my-progress", user?._id],
    queryFn: getMyProgress,
    enabled: !!user,
  });

  const lessons    = (lessonsData?.data?.data?.data || []).sort((a, b) => a.lessonOrder - b.lessonOrder);
  const activeLevel = levels.find((l) => l._id === effectiveLevelId);

  const progressItems = progressData?.data?.data?.data || [];
  const completedIds  = new Set(progressItems.map((p) => p.lessonId?._id || p.lessonId));

  const completedInLevel = lessons.filter((l) => completedIds.has(l._id)).length;
  const progressPercent =
    lessons.length > 0
      ? Math.round((completedInLevel / lessons.length) * 100)
      : 0;

  const nextLesson =
    lessons.find((l) => !completedIds.has(l._id)) || lessons[0];

  return (
    <section className="lessons-page" dir="rtl">

      {/* Header */}
      <p className="lessons-label">الدروس</p>
      <h1 className="lessons-title">تقدمك</h1>

      {/* ── Progress card ── */}
      <div className="progress-card">
        <img
          className="progress-card-img"
          src={nextLesson?.thumbnailUrl || lessonpage}
          alt="next lesson"
          loading="lazy"
          decoding="async"
        />
        <div className="progress-card-body">
          <div>
            <h2 className="progress-card-title">
              {nextLesson?.title || "اختر مستوى للبدء"}
            </h2>
            <p className="progress-card-desc">
              {nextLesson?.description || "تعلم لغة الإشارة العربية خطوة بخطوة."}
            </p>
            <div className="progress-card-meta">
              <span>
                <Star size={14} color="#FFC107" fill={nextLesson?.avgRating > 0 ? "#FFC107" : "none"} />
                {nextLesson?.avgRating > 0 ? nextLesson.avgRating.toFixed(1) : "—"}
              </span>
              <span>
                <UserRound size={14} color="#EB6837" />
                {activeLevel?.title || ""}
              </span>
              <span>
                <Clock size={14} color="#EB6837" />
                {nextLesson?.duration || "—"}
              </span>
            </div>
          </div>

          {/* Progress bar + button */}
          <div className="progress-footer">
            <div className="progress-bar-section">
              <div className="progress-bar-labels">
                <span className="progress-count-text">
                  {completedInLevel} من {lessons.length} دروس مكتملة
                </span>
                <span className="progress-pct-text">{progressPercent}٪</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <button
              className="progress-cta-btn"
              onClick={() => nextLesson && navigate(`/Learnnow/${nextLesson._id}`)}
            >
              {completedInLevel > 0 ? "اكمل" : "ابدأ الآن"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Level tabs ── */}
      <div className="level-tabs">
        {sortedLevels.map((level, index) => (
          <button
            key={level._id}
            className={`level-tab ${effectiveLevelId === level._id ? "active" : ""}`}
            onClick={() => setActiveLevelId(level._id)}
          >
            <img src={LEVEL_IMAGES[index % LEVEL_IMAGES.length]} alt="" />
            <span>{level.title}</span>
          </button>
        ))}
      </div>

      {/* ── Lesson cards grid ── */}
      <div className="lessons-grid">
        {isLoading ? (
          <div className="lessons-state">جاري التحميل...</div>
        ) : lessons.length === 0 ? (
          <div className="lessons-state">لا توجد دروس لهذا المستوى</div>
        ) : (
          lessons.map((lesson, index) => {
            const isCompleted = completedIds.has(lesson._id);
            return (
              <div
                key={lesson._id}
                className={`lesson-card ${isCompleted ? "lesson-card--done" : ""}`}
                onClick={() => navigate(`/Learnnow/${lesson._id}`)}
              >
                {/* Thumbnail */}
                <div className="lesson-card-thumb">
                  <img
                    src={lesson.thumbnailUrl || FALLBACK_THUMBS[index % FALLBACK_THUMBS.length]} 
                    alt={lesson.title}
                    loading="lazy"
                    decoding="async"
                  />
                  {isCompleted && (
                    <div className="lesson-done-overlay">
                      <CheckCircle size={16} color="#fff" />
                      <span>مكتمل</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="lesson-card-body">
                  <h3 className="lesson-card-title">{lesson.title}</h3>
                  <p className="lesson-card-desc">{lesson.description}</p>

                  <div className="lesson-card-meta">
                    <StarDisplay rating={lesson.avgRating || 0} />
                    <span className="lesson-card-duration">
                      <Clock size={13} color="#EB6837" />
                      {lesson.duration || "—"}
                    </span>
                  </div>

                  <button
                    className={`lesson-card-btn ${isCompleted ? "lesson-card-btn--done" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/Learnnow/${lesson._id}`);
                    }}
                  >
                    {isCompleted ? "راجع الدرس" : "تعلم الآن"}
                  </button>
                </div>
              </div>
            );
            
          })
          
        )}
        
      </div>
      

    </section>
  );
}
