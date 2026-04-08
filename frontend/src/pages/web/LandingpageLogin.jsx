import { useState } from "react";
import "../../styles/landing.css";
import logoImage from "../../assets/images/Group.png";
import logo from "../../assets/images/logo2.png";
import one from "../../assets/images/one.png";
import two from "../../assets/images/two.png";
import three from "../../assets/images/three.png";
import four from "../../assets/images/four.png";
import letters from "../../assets/images/letters.png";
import family from "../../assets/images/family.png";
import home from "../../assets/images/home.png";
import food from "../../assets/images/food.png";
import {
  Star,
  Clock,
  BookOpen,
  Trophy,
  Users,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllLevels, getLevelLessons } from "../../api/levelApi";
import { getPublicStats } from "../../api/statsApi";
import { getMyProgress } from "../../api/lessonApi";
import useAuth from "../../hooks/useAuth";

const LEVEL_IMAGES = [one, two, three, four];
const FALLBACK_THUMBS = [letters, family, home, food];

const testimonials = [
  {
    text: "بصراحة المستوى الأول من صوت اليد فرق مع ابني جداً، لأول مرة يحفظ حروف وأرقام بلغة الإشارة بطريقة ممتعة. الاختبارات بالكاميرا خلته يتحمس ويفتح التطبيق لوحده كل يوم.",
    name: "منى السيد",
  },
  {
    text: "المنصة سهلة جداً وبسيطة، حسيت إن التعلم بقى ممتع ومش معقد. أول مرة أحس بثقة وأنا بأستخدم لغة الإشارة في تواصلي اليومي.",
    name: "أحمد علي",
  },
];

export default function LandingpageLogin() {
  const [activeLevelId, setActiveLevelId] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { data: progressData } = useQuery({
    queryKey: ["my-progress", user?._id],
    queryFn: getMyProgress,
    enabled: !!user,
  });

  const completedIds = new Set(
    (progressData?.data?.data?.data || []).map((p) => p.lessonId?._id || p.lessonId)
  );

  const { data: levelsData } = useQuery({
    queryKey: ["levels"],
    queryFn: getAllLevels,
  });

  const { data: publicStatsData } = useQuery({
    queryKey: ["public-stats"],
    queryFn: getPublicStats,
    staleTime: 5 * 60 * 1000,
  });

  const publicStats = publicStatsData?.data?.data;

  const levels = levelsData?.data?.data?.data || [];
  const sortedLevels = [...levels].sort((a, b) => a.levelOrder - b.levelOrder);
  const effectiveLevelId = activeLevelId ?? sortedLevels[0]?._id;

  const { data: lessonsData, isLoading: lessonsLoading } = useQuery({
    queryKey: ["level-lessons", effectiveLevelId],
    queryFn: () => getLevelLessons(effectiveLevelId),
    enabled: !!effectiveLevelId,
  });

let lessonsList = lessonsData?.data?.data?.data || [];



const lessons = lessonsList.sort((a, b) => a.lessonOrder - b.lessonOrder);

  const prevTestimonial = () =>
    setCurrentTestimonial((i) =>
      i === 0 ? testimonials.length - 1 : i - 1
    );
  const nextTestimonial = () =>
    setCurrentTestimonial((i) =>
      i === testimonials.length - 1 ? 0 : i + 1
    );

  return (
    <>
    <div className="lp-container">
            {/* ── Hero ── */}
      <section className="lp-hero" dir="rtl">
        <div className="lp-hero-content">
          <span className="lp-hero-badge">🤟 منصة تعلم لغة الإشارة العربية</span>

          <h1 className="lp-hero-title">
            تواصل أوضح <span>بلغة الإشارة</span>
          </h1>

          <p className="lp-hero-desc">
            ادخل إلى عالمٍ ممتع تتعلّم فيه لغة الإشارة بأسلوب بسيط وواضح.
            صوت اليد يأخذك في رحلة لطيفة خطوة بخطوة مع تجربة تفاعلية ممتعة
            تناسب جميع الأعمار.
          </p>

          <div className="lp-hero-cta-row">
            <button className="lp-cta-btn" onClick={() => navigate(isAuthenticated ? "/Lessons" : "/login")}>
              ابدأ التعلم الآن
            </button>
            <span
              className="lp-cta-secondary"
              onClick={() => navigate(isAuthenticated ? "/Community" : "/login")}
            >
              تصفح المجتمع
            </span>
          </div>

          <div className="lp-stats-row">
            <div className="lp-stat">
              <span className="lp-stat-number">
                {publicStats?.totalUsers != null ? `${publicStats.totalUsers}+` : "..."}
              </span>
              <span className="lp-stat-label">متعلم</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat-number">
                {publicStats?.totalLessons != null ? `${publicStats.totalLessons}+` : "..."}
              </span>
              <span className="lp-stat-label">درس</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat-number">
                {publicStats?.totalLevels ?? sortedLevels.length ?? "..."}
              </span>
              <span className="lp-stat-label">مستويات</span>
            </div>
          </div>
        </div>

        <div className="lp-hero-image">
          <img src={logoImage} alt="صوت اليد" />
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── Features ── */}
    <section className="lp-features-section" dir="rtl">
  <div className="lp-features-content">
    <h1 className="lp-features-title">
      <span>من نحن</span>
    </h1>

    <p className="lp-features-desc">
      صوت اليد منصة رقمية لتعلّم لغة الإشارة العربية، تقرّب المسافة بين الصم وضعاف السمع وأسرهم والمجتمع.
      <br />
      نقدّم دروسًا بصرية تفاعلية، عبر فيديوهات قصيرة وتمارين خطوة بخطوة، تناسب جميع الأعمار والمستويات.
      <br />
      نهدف إلى تمكين المستخدم من استخدام لغة الإشارة بثقة في الحياة اليومية، وجعل التقنية والذكاء الاصطناعي جسرًا حقيقيًا نحو مجتمع أكثر شمولًا وفهمًا للإشارة.
    </p>
  </div>

  <div className="lp-features-image">
    <img src={logo} alt="صوت اليد" />
  </div>
      </section>

      {/* ── Levels + Courses ── */}
      <section className="lp-levels-section" dir="rtl">
        <span className="lp-section-badge">مساراتنا التعليمية</span>
        <h2 className="lp-section-title">ابدأ رحلتك من أي نقطة</h2>
        <p className="lp-section-sub">
          تعلّم لغة الإشارة بسهولة، من الأساسيات إلى الإتقان. مسارات تعليمية
          تناسب جميع المستويات والأعمار.
        </p>

        {/* Level tabs */}
        <div className="lp-level-tabs">
          {sortedLevels.map((level, index) => (
            <button
              key={level._id}
              className={`lp-level-tab ${effectiveLevelId === level._id ? "active" : ""}`}
              onClick={() => setActiveLevelId(level._id)}
            >
              <img src={LEVEL_IMAGES[index % LEVEL_IMAGES.length]} alt="" loading="lazy" />
              <span>{level.title}</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="lp-cards-grid">
          {lessonsLoading ? (
            <div className="lp-cards-state">جاري التحميل...</div>
          ) : lessons.length === 0 ? (
            <div className="lp-cards-state">لا توجد دروس لهذا المستوى</div>
          ) : (
            lessons.slice(0,4).map((lesson, index) => {
              const isCompleted = completedIds.has(lesson._id);
              return (
                <div
                  key={lesson._id}
                  className={`lp-course-card${isCompleted ? " lp-course-card--done" : ""}`}
                >
                  <div className="lp-course-thumb">
                    <img
                      src={lesson.thumbnailUrl || FALLBACK_THUMBS[index % FALLBACK_THUMBS.length]} srcSet="image@2x.png 2x"
                      alt={lesson.title}
                      loading="lazy"
                      decoding="async"
                    />
                    {isCompleted && (
                      <div className="lp-done-overlay">
                        <CheckCircle size={16} color="#fff" />
                        <span>مكتمل</span>
                      </div>
                    )}
                  </div>
                  <div className="lp-course-body">
                    <h3 className="lp-course-title">{lesson.title}</h3>
                    <p className="lp-course-desc">{lesson.description}</p>

                    <div className="lp-course-meta">
                      <span className="lp-course-meta-item">
                        <Star size={13} color="#FFC107" fill={isCompleted ? "#FFC107" : "none"} />
                        {lesson.avgRating > 0 ? lesson.avgRating.toFixed(1) : "—"}
                      </span>
                      <span className="lp-course-meta-item">
                        <Clock size={13} color="#EB6837" />
                        {lesson.duration || "—"}
                      </span>
                    </div>

                    <button
                      className={`lp-course-btn${isCompleted ? " lp-course-btn--done" : ""}`}
                      onClick={() => navigate(isAuthenticated ? `/Learnnow/${lesson._id}` : "/login")}
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

      {/* ── Testimonials ── */}
      <section className="lp-testimonials-section" dir="rtl">
        <span className="lp-section-badge">آراء مستخدمينا</span>
        <h2 className="lp-section-title">رحلة صوت اليد بعيون مستخدميه</h2>
        <p className="lp-section-sub">
          آلاف المتعلمين يثقون في صوت اليد لتعلم لغة الإشارة بطريقة ممتعة
          وفعالة.
        </p>

        <div className="lp-testimonial-card">
          <span className="lp-quote-mark">"</span>
          <p className="lp-testimonial-text" key={currentTestimonial}>
            {testimonials[currentTestimonial].text}
          </p>
          <div className="lp-testimonial-footer">
            <span className="lp-testimonial-name">
              {testimonials[currentTestimonial].name}
            </span>
            <div className="lp-testimonial-nav">
              <button onClick={prevTestimonial} aria-label="السابق">
                <ChevronRight size={18} />
              </button>
              <button onClick={nextTestimonial} aria-label="التالي">
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="lp-testimonial-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`lp-dot ${i === currentTestimonial ? "active" : ""}`}
              onClick={() => setCurrentTestimonial(i)}
              aria-label={`testimonial ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
