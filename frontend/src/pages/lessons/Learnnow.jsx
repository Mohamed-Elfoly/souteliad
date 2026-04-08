import { useState } from "react";
import {
  Star, Ribbon, UserRound, BookOpenText, Clock, Globe,
  ChevronLeft, Play, CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLesson, addRating, getMyRating, getMyProgress } from "../../api/lessonApi";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import levelone from "../../assets/images/levelone.png";
import "../../styles/learnnow.css";

function StarRating({ lessonId, avgRating, numRatings }) {
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState(0);

  const { data: myRatingData } = useQuery({
    queryKey: ["my-rating", lessonId],
    queryFn: () => getMyRating(lessonId),
    enabled: !!lessonId,
  });

  const myRating = myRatingData?.data?.data?.data;
  const alreadyRated = myRating !== null && myRating !== undefined;

  const mutation = useMutation({
    mutationFn: (rating) => addRating(lessonId, rating),
    onSuccess: () => {
      toast.success("شكراً على تقييمك!");
      queryClient.invalidateQueries({ queryKey: ["my-rating", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["level-lessons"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ في التقييم");
    },
  });

  const displayRating = alreadyRated ? myRating : hovered || avgRating;

  return (
    <div className="rating-widget">
      <div className="rating-stars-row">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={32}
            color="#FFC107"
            fill={s <= displayRating ? "#FFC107" : "none"}
            style={{
              cursor: alreadyRated ? "default" : "pointer",
              transition: "transform 0.1s",
              transform: !alreadyRated && hovered >= s ? "scale(1.2)" : "scale(1)",
            }}
            onMouseEnter={() => !alreadyRated && setHovered(s)}
            onMouseLeave={() => !alreadyRated && setHovered(0)}
            onClick={() => !alreadyRated && !mutation.isPending && mutation.mutate(s)}
          />
        ))}
        <span className="rating-avg">
          {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          {numRatings > 0 && <span className="rating-count"> ({numRatings} تقييم)</span>}
        </span>
      </div>
      <p className="rating-hint" style={{ color: alreadyRated ? "#22c55e" : "#868687" }}>
        {alreadyRated
          ? `✓ قيّمت هذا الدرس بـ ${myRating} نجوم`
          : "اضغط على النجوم لتقييم الدرس"}
      </p>
    </div>
  );
}

export default function Learnnow() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => getLesson(lessonId),
    enabled: !!lessonId,
  });

  const { data: progressData } = useQuery({
    queryKey: ["my-progress"],
    queryFn: getMyProgress,
    enabled: !!user,
  });

  const lesson = data?.data?.data?.data;

  const progressItems = progressData?.data?.data?.data || [];
  const completedIds  = new Set(progressItems.map((p) => p.lessonId?._id || p.lessonId));
  const isCompleted   = completedIds.has(lessonId);

  if (isLoading) {
    return (
      <div className="learnnow-loading">
        <div className="learnnow-spinner" />
      </div>
    );
  }

  return (
    <div className="learnnow-page" dir="rtl">

      {/* ── DARK HERO BANNER ── */}
      <div className="learnnow-hero">
        <div className="learnnow-hero-inner">

          {/* Completion banner */}
          {isCompleted && (
            <div className="learnnow-completed-banner">
              <CheckCircle size={20} color="#4ade80" />
              أتممت هذا الدرس بنجاح — يمكنك مراجعته في أي وقت
            </div>
          )}

          {/* Breadcrumb */}
          <div className="learnnow-breadcrumb">
            <span className="bc-link">الدرس</span>
            <ChevronLeft size={14} color="#EB6837" />
            <span className="bc-link">{lesson?.levelId?.title || "المستوى"}</span>
            <ChevronLeft size={14} color="#EB6837" />
            <span className="bc-current">{lesson?.title || "..."}</span>
          </div>

          {/* Hero split: info + thumbnail */}
          <div className="learnnow-hero-split">

            {/* Left: info */}
            <div className="learnnow-hero-info">
              <span className="learnnow-level-badge">
                {lesson?.levelId?.title || "المستوى"}
              </span>

              <h1 className="learnnow-hero-title">{lesson?.title || ""}</h1>

              <p className="learnnow-hero-desc">{lesson?.description || ""}</p>

              {/* Stat chips */}
              <div className="learnnow-stats-row">
                <div className="stat-chip">
                  <Clock size={24} color="rgba(235, 104, 55, 1)" />
                  <span>{lesson?.duration || "—"}</span>
                </div>
                <div className="stat-chip">
                  <BookOpenText size={24} color="rgba(235, 104, 55, 1)" />
                  <span>جميع الأعمار</span>
                </div>
                {lesson?.avgRating > 0 && (
                  <div className="stat-chip stat-chip--gold">
                    <Star size={14} fill="#FFC107" color="#FFC107" />
                    <span>{lesson.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="learnnow-rating">
              
            <div>
              <p className="learnnow-card-text" style={{ marginBottom: 0 }}>
                ساعدنا في تحسين المحتوى بتقييمك الصادق
              </p>
            </div>
          
          <StarRating
            lessonId={lessonId}
            avgRating={lesson?.avgRating || 0}
            numRatings={lesson?.numRatings || 0}
          />
              </div>
            </div>

            {/* Right: thumbnail with play overlay */}
<div
  className="learnnow-hero-thumb thumbnail-box"
>
  <img
    src={lesson?.thumbnailUrl || levelone}
    alt={lesson?.title || "lesson thumbnail"}
  />

  {isCompleted && (
    <div className="learnnow-done-overlay">
      <CheckCircle size={15} color="#fff" />
      مكتمل
    </div>
  )}



  {/* 👇 الزرار هنا بقى */}
  <button
    className={`learnnow-watch-btn learnnow-thumb-btn ${
      isCompleted ? "learnnow-watch-btn--done" : ""
    }`}
    onClick={(e) => {
      e.stopPropagation(); // مهم عشان مايشغلش click بتاع الصورة
      navigate(`/Levelone/${lessonId}`);
    }}
  >
    <Play size={18} fill="#fff" color="#fff" />
    {isCompleted ? "راجع الدرس مجدداً" : "ابدأ التعلّم الآن"}
  </button>
</div>
                           

          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="learnnow-body">

        {/* About card */}
        <div className="learnnow-card">
          <h2 className="learnnow-card-title">نبذة عن الدرس</h2>
          <p className="learnnow-card-text">في درس الحروف والأرقام تبدأ رحلتك مع صوت اليد من الأساس؛ حيث تتعرّف على شكل كل حرف ورقم بلغة الإشارة من خلال فيديوهات قصيرة واضحة ورسوم كرتونية قريبة للقلب. يرافقك الدرس خطوة بخطوة لتربط بين الحركة، وشكل الحرف أو الرقم، وصوته أو معناه، حتى تصبح الإشارة جزءًا طبيعيًا من طريقة قراءتك وعدّك.
بعد كل مجموعة حروف أو أرقام، تجد تمارين بسيطة وتفاعلية تساعدك على التذكّر والتطبيق في مواقف يومية، مثل كتابة الاسم أو قول العمر أو عدد الأشياء من حولك. صُمّم هذا الدرس ليكون مناسبًا لجميع الأعمار، ولمن يتعلّم لأول مرة أو يرغب في تثبيت ما تعلّمه سابقًا، في تجربة تعليمية مريحة وواضحة.</p>

          <h3 className="learnnow-card-subtitle">خصائص الدرس</h3>
          <div className="learnnow-features-grid">
            <div className="learnnow-feature-item">
              <div className="feature-icon-wrap">
                <Globe size={22} color="#EB6837" />
              </div>
              <div>
                <h4>100% أونلاين</h4>
                <p>اتعلم في أي وقت يناسبك وبالسرعة اللي تريحك.</p>
              </div>
            </div>
            <div className="learnnow-feature-item">
              <div className="feature-icon-wrap">
                <UserRound size={22} color="#EB6837" />
              </div>
              <div>
                <h4>مناسب للمبتدئين</h4>
                <p>مش محتاج أي خبرة سابقة بلغة الإشارة.</p>
              </div>
            </div>
            <div className="learnnow-feature-item">
              <div className="feature-icon-wrap">
                <Ribbon size={22} color="#EB6837" />
              </div>
              <div>
                <h4>موثوق</h4>
                <p>المحتوى بإشراف متخصصين من كلية التربية الخاصة.</p>
              </div>
            </div>
          </div>
                  {/* Bottom CTA */}
        <div className="learnnow-bottom-cta">
          <button
            className={`learnnow-watch-btn ${isCompleted ? "learnnow-watch-btn--done" : ""}`}
            onClick={() => navigate(`/Levelone/${lessonId}`)}
          >
            <Play size={18} fill="#fff" color="#fff" />
            {isCompleted ? "راجع الدرس مجدداً" : "شاهد الدرس الآن"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
