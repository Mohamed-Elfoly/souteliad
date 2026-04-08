import levelone from "../../assets/images/levelone.png";
import { Star, Ribbon, UserRound, MoveRight, Clock, Globe, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLesson } from "../../api/lessonApi";
import { getQuizByLesson } from "../../api/quizApi";
import "../../styles/learnnow.css";
import "../../styles/levelone.css";

export default function Testyourself() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const { data: lessonData, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLesson(lessonId),
    enabled: !!lessonId,
  });

  const { data: quizzesData, isLoading: quizLoading } = useQuery({
    queryKey: ['lesson-quizzes', lessonId],
    queryFn: () => getQuizByLesson(lessonId),
    enabled: !!lessonId,
  });

  const lesson = lessonData?.data?.data?.data;

  const quizzes   = quizzesData?.data?.data?.data || [];
  const quiz      = quizzes[0];
  const isLoading = lessonLoading || quizLoading;

  if (isLoading) {
    return <div className="lesson-state">جاري التحميل...</div>;
  }

  return (
    <div className="lesson-page">
      <div className="one_div">
        <p className="lesson_one">الدرس</p>
        <ChevronLeft size={20} color="#EB6837" />
        <p className="lesson_one">{lesson?.levelId?.title || 'المستوى'}</p>
        <ChevronLeft size={20} color="#EB6837" />
        <p>{lesson?.title || '...'}</p>
      </div>

      <section className="hero2">
        <img src={lesson?.thumbnailUrl || levelone} alt="lesson" />
        <div className="hero2-right">
          <div className="info_right">
            <h2>{lesson?.title || ''}</h2>
          </div>
          <div className="stars">
            <Star /><Star /><Star /><Star />
            <span>4</span>
          </div>
        </div>
        <div className="details">
          <p className="p_bold">درس اليوم: إشارة جديدة بطريقة بسيطة وواضحة</p>
          <p>{lesson?.description || 'شاهد الشرح خطوة بخطوة، وتعلّم كيفية أداء الإشارة بشكل صحيح.'}</p>
        </div>
      </section>

      <div className="info-cards">
        <div className="card">
          <span className="person"><UserRound color="#EB6837" /></span>
          <p>{lesson?.levelId?.title || 'الأول'}</p>
        </div>
        <div className="card">
          <span className="star"><Star color="#EB6837" /></span>
          <p>جميع الأعمار</p>
        </div>
        <div className="card">
          <span className="clock"><Clock color="#EB6837" /></span>
          <p>12 دقيقة</p>
        </div>
      </div>

      <section className="about">
        <h2>نبذة عن الدرس</h2>
        <p>{lesson?.description || ''}</p>
        <h3>خصائص الدرس</h3>
        <div className="features">
          <div className="feature">
            <div><Globe color="#868687" /><h4>100% أونلاين</h4></div>
            <p>اتعلم في أي وقت يناسبك وبالسرعة اللي تريحك.</p>
          </div>
          <div className="feature">
            <div><UserRound color="#868687" /><h4>مناسب للمبتدئين</h4></div>
            <p>مش محتاج أي خبرة سابقة بلغة الإشارة.</p>
          </div>
          <div className="feature">
            <div><Ribbon color="#868687" /><h4>موثوق</h4></div>
            <p>المحتوى بإشراف متخصصين من كلية التربية الخاصة.</p>
          </div>
        </div>
        <button
          className="learn_btnn"
          disabled={!quiz}
          onClick={() => quiz && navigate(`/quiz/${quiz._id}/1`, { state: { lessonId } })}
        >
          <MoveRight />
          <p>{quiz ? 'اختبر مهاراتك الآن' : 'لا يوجد اختبار متاح'}</p>
        </button>
      </section>
    </div>
  );
}
