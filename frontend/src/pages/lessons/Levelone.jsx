import { MoveRight, ChevronLeft, Clock, BookOpenText, Info, Globe, UserRound,  Ribbon,   } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLesson } from "../../api/lessonApi";
import { getQuizByLesson, getQuestions } from "../../api/quizApi";
import "../../styles/levelone.css";

function getVideoEmbed(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return null; // direct file URL — use <video> tag
}

export default function Levelone() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: lessonLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => getLesson(lessonId),
    enabled: !!lessonId,
  });

  const { data: quizzesData, isLoading: quizLoading } = useQuery({
    queryKey: ["lesson-quizzes", lessonId],
    queryFn: () => getQuizByLesson(lessonId),
    enabled: !!lessonId,
  });

  const lesson = data?.data?.data?.data;
  const levelId = lesson?.levelId?._id;
  const quizzes = quizzesData?.data?.data?.data || [];
  const quiz = quizzes[0];

  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ["questions", quiz?._id],
    queryFn: () => getQuestions(quiz._id),
    enabled: !!quiz?._id,
  });

  const hasQuestions = (questionsData?.data?.data?.data?.length ?? 0) > 0;
  const activeQuiz = quiz && hasQuestions ? quiz : null;

  if (lessonLoading || quizLoading || (quiz && questionsLoading)) {
    return <div className="lesson-state">جاري التحميل...</div>;
  }

  return (
    <div className="lesson-page" dir="rtl">

      {/* Breadcrumb */}
      <div className="one_div">
        <p className="lesson_one">الدرس</p>
        <ChevronLeft size={20} color="#EB6837" />
        <p className="lesson_one">{lesson?.levelId?.title || "المستوى"}</p>
        <ChevronLeft size={20} color="#EB6837" />
        <p>{lesson?.title || "..."}</p>
      </div>

      {/* Video */}
      <div className="video-section">
        {lesson?.videoUrl ? (
          getVideoEmbed(lesson.videoUrl) ? (
            <iframe
              src={getVideoEmbed(lesson.videoUrl)}
              title={lesson?.title || "lesson video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="video-iframe"
            />
          ) : (
            <video
              src={lesson.videoUrl}
              controls
              className="video-iframe"
            />
          )
        ) : (
          <div className="no-video">لا يوجد فيديو</div>
        )}
      </div>

      {/* Info bar */}
      <div className="video-info-bar">
        <div className="video-info-left">
          <h2>{lesson?.title || ""}</h2>
          <p className="video-info-dec"><span>درس اليوم :</span> إشارة جديدة بطريقة بسيطة وواضحة </p>
          <small className="video-info-small">شاهد الشرح خطوة بخطوة، وتعلّم كيفية أداء الإشارة بشكل صحيح.</small>
          <div className="levelone-features-grid">
            <div className="levelone-feature-item">
              <div className="levelone-feature-icon-wrap">
                <UserRound size={22} color="#EB6837" />
              </div>
              <div>
                <h4>{lesson?.levelId?.title || "المستوى"}</h4>
              </div>
            </div>
            <div className="levelone-feature-item">
              <div className="levelone-feature-icon-wrap">
                <Clock size={22} color="#EB6837" />
              </div>
              <div>
                <h4>{lesson?.duration || "—"}</h4>
              </div>
            </div>
            <div className="levelone-feature-item">
              <div className="levelone-feature-icon-wrap">
                <BookOpenText size={22} color="#EB6837" />
              </div>
              <div>
                <h4>جميع الأعمار</h4>
              </div>
            </div>
          </div>


        </div>
        {/* <button
          className="learn_btnn"
          onClick={() => activeQuiz ? navigate(`/quiz/${activeQuiz._id}/1`, { state: { lessonId, levelId } }) : navigate("/Lessons", { state: { levelId } })}
        >
          <MoveRight />
          <p>{activeQuiz ? "اختبر مهاراتك الآن" : "العودة للدروس"}</p>
        </button> */}
      </div>

      {/* Description */}
            {/* ── BODY ── */}
      <div className="learnnow-body">

        {/* About card */}
        <div className="learnnow">
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
                {/* Prominent quiz CTA */}
      {activeQuiz ? (
        <div className="quiz-cta">
          <button
            className="quiz-cta-btn"
            onClick={() => navigate(`/quiz/${activeQuiz._id}/1`, { state: { lessonId, levelId } })}
          >
            <MoveRight size={20} />
            اختبر مهاراتك الآن
          </button>
        </div>
      ) : (
        <div className="no-quiz-card">
          {/* زر يودّي للدروس */}
          <button
           className="quiz-cta-btn full-text-btn"
           onClick={() => navigate(`/lessons`)} // عدّلي الرابط حسب صفحة الدروس عندك
          > 
          التالي
          </button>
        </div>
         )}
        </div>
      </div>
    </div>
  );
}
