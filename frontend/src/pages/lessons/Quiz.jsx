import { useState, useRef, useEffect } from "react";
import confirmanswer from "../../assets/images/confirmanswer.png";
import congratulation from "../../assets/images/congratulation.png";
import { ChevronLeft, Play, RotateCcw, Video, Info } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQuestions, submitQuizAttempt } from "../../api/quizApi";
import "../../styles/question.css";
import "../../styles/play.css";

const QUESTION_TITLES = [
  'السؤال الأول', 'السؤال الثاني', 'السؤال الثالث', 'السؤال الرابع',
  'السؤال الخامس', 'السؤال السادس', 'السؤال السابع', 'السؤال الثامن',
  'السؤال التاسع', 'السؤال العاشر',
];

const PRE_SECONDS  = 3; // "get ready" countdown
const REC_SECONDS  = 5; // actual recording duration

// ─── phases ──────────────────────────────────────────────────────────────────
// idle → preview → pre → recording → done

export default function Quiz() {
  const { quizId }  = useParams();
  const navigate    = useNavigate();
  const { lessonId, levelId } = useLocation().state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers]           = useState({});
  const [showModal, setShowModal]       = useState(false);
  const [cameraError, setCameraError]   = useState(null);

  // Camera phases
  const [phase, setPhase]       = useState('idle');      // idle|preview|pre|recording|done
  const [preCount, setPreCount] = useState(PRE_SECONDS);
  const [recCount, setRecCount] = useState(REC_SECONDS);

  const videoRef         = useRef(null);
  const streamRef        = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks   = useRef([]);
  const timerRef         = useRef(null);

  // ── queries ─────────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['questions', quizId],
    queryFn:  () => getQuestions(quizId),
    enabled:  !!quizId,
  });

  const mutation = useMutation({
    mutationFn: submitQuizAttempt,
    onSuccess: (res) => {
      const attempt = res?.data?.data?.data;
      navigate('/Result', {
        state: {
          score:      attempt?.score      ?? 0,
          totalMarks: attempt?.totalMarks ?? 0,
          passed:     attempt?.passed     ?? false,
          lessonId,
          levelId,
        },
      });
    },
  });

  const questions      = data?.data?.data?.data || [];
  const totalQuestions = questions.length;
  const question       = questions[currentIndex];

  // ── helpers ──────────────────────────────────────────────────────────────────
  const stopAll = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    try { mediaRecorderRef.current?.stop(); } catch {}
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current        = null;
    mediaRecorderRef.current = null;
    recordedChunks.current   = [];
  };

  const resetAll = () => {
    stopAll();
    setPhase('idle');
    setPreCount(PRE_SECONDS);
    setRecCount(REC_SECONDS);
    setCameraError(null);
  };

  // Assign stream to <video> once it mounts (phase becomes 'preview')
  useEffect(() => {
    if ((phase === 'preview' || phase === 'pre' || phase === 'recording') &&
        videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  // Reset camera when navigating between questions
  useEffect(() => {
    resetAll();
    setShowModal(false);
  }, [currentIndex]); // eslint-disable-line

  // Full cleanup on unmount
  useEffect(() => () => stopAll(), []); // eslint-disable-line

  // ── Phase 1: open camera (preview only, no recording) ────────────────────
  const openCamera = async () => {
    resetAll();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setPhase('preview');
    } catch {
      setCameraError('من فضلك اسمح باستخدام الكاميرا في إعدادات المتصفح');
    }
  };

  // ── Phase 2: 3-2-1 "get ready" pre-countdown ────────────────────────────
  const startPreCountdown = () => {
    setPhase('pre');
    setPreCount(PRE_SECONDS);
    let remaining = PRE_SECONDS;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setPreCount(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        beginCapture();
      }
    }, 1000);
  };

  // ── Phase 3: actually record ─────────────────────────────────────────────
  const beginCapture = () => {
    const stream = streamRef.current;
    if (!stream) return;

    recordedChunks.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : '';
    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});

    mr.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.current.push(e.data); };
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      setPhase('done');
    };

    mr.start();
    mediaRecorderRef.current = mr;

    setPhase('recording');
    setRecCount(REC_SECONDS);
    let remaining = REC_SECONDS;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setRecCount(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        mr.stop();
      }
    }, 1000);
  };

  // ── Quiz logic ────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    mutation.mutate({
      quizId,
      answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })),
    });
  };

  const goNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((i) => i + 1);
    else handleSubmit();
  };

  const selectOption = (idx) => {
    if (question) setAnswers((prev) => ({ ...prev, [question._id]: idx }));
  };

  // ── render guards ─────────────────────────────────────────────────────────
  if (isLoading) return <div className="quiz-state">جاري التحميل...</div>;
  if (!question) return (
    <div className="quiz-empty-state" dir="rtl">
      <div className="quiz-empty-icon"><Info size={36} color="#6b7280" /></div>
      <h3>لا توجد أسئلة في هذا الاختبار</h3>
      <p>هذا الاختبار لا يحتوي على أسئلة حالياً</p>
      <button className="quiz-empty-btn" onClick={() => navigate("/Lessons", { state: { levelId } })}>
        العودة للدروس
      </button>
    </div>
  );

  const progress       = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const questionTitle  = QUESTION_TITLES[currentIndex] || `السؤال ${currentIndex + 1}`;
  const selectedOptIdx = answers[question._id] ?? null;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isPractical    = question.questionType === 'ai-practice';
  const recProgressPct = ((REC_SECONDS - recCount) / REC_SECONDS) * 100;
  const showVideo      = phase === 'preview' || phase === 'pre' || phase === 'recording';

  return (
    <>
      {/* Breadcrumb */}
      <div className="one_div question_dev">
        <p className="lesson_one">الدرس</p>
        <ChevronLeft size={20} color="#EB6837" />
        <p className="lesson_one">اختبر مهاراتك الآن</p>
        <ChevronLeft size={20} color="#EB6837" />
        <p>{questionTitle}</p>
      </div>

      <div className="quiz-pagess">
              <div className="quiz-page">
        {/* Quiz progress bar */}
        <div className="quiz-progress">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="quiz-header">
          <h2>{questionTitle}</h2>
          <span>{question.marks === 1 ? '1 درجة' : `${question.marks} درجات`}</span>
        </div>

        {/* ══ MCQ / True-False ══════════════════════════════════════════════ */}
        {!isPractical ? (
          <>
            <p className="quiz-question">{question.questionText}</p>
            <div className={`quiz-body${question.imageUrl ? '' : ' quiz-body--full'}`}>
              {question.imageUrl && (
                <div className="quiz-image"><img src={question.imageUrl} alt="" /></div>
              )}
              <div className="quiz-options">
                {(question.options || []).map((opt, index) => (
                  <label
                    key={index}
                    className={`option ${selectedOptIdx === index ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      checked={selectedOptIdx === index}
                      onChange={() => selectOption(index)}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
            {currentIndex > 0 && (
              <button className="prev-btn" onClick={() => setCurrentIndex((i) => i - 1)}>السابق</button>
            )}
            <button
              className={currentIndex === 0 ? 'next-btn' : 'nextt-btn'}
              onClick={goNext}
              disabled={mutation.isPending || selectedOptIdx === null}
            >
              {mutation.isPending ? 'جاري الإرسال...' : isLastQuestion ? 'إنهاء الاختبار' : 'التالي'}
            </button>
          </>
        ) : (

        /* ══ AI Practice ══════════════════════════════════════════════════ */
          <>
            <p className="quizz-question">{question.questionText}</p>

            <div className="examm-page">
              <div className="examm-container">

                {/* Instructions */}
                <div className="examm-text">
                  <p className="top-text" dir="rtl">قم بأداء الإشارة المطلوبة أمام الكاميرا.</p>
                  <h2 className="section-title" dir="rtl">نص التعليمات:</h2>
                  <ol className="steps" dir="rtl">
                    <li>اضغط <strong>تشغيل الكاميرا</strong> وتأكد أنك واضح أمامها.</li>
                    <li>اضغط <strong>ابدأ التسجيل</strong> وانتظر العد التنازلي ٣ ثواني.</li>
                    <li>اعمل الإشارة المطلوبة بلغة الإشارة.</li>
                    <li>سيتم التسجيل تلقائياً لمدة ٥ ثواني ثم يتوقف.</li>
                  </ol>
                  <h3 className="note-title" dir="rtl">ملاحظة:</h3>
                  <p className="note-text" dir="rtl">
                    يتم استخدام الكاميرا فقط أثناء الامتحان لتقييم أداء لغة الإشارة،
                    ولا يتم حفظ أي فيديوهات أو صور بدون إذنك.
                  </p>
                </div>

                {/* ── Camera box ── */}
                <div className="camera-box">
                  {cameraError && (
                    <div className="camera-error-msg">{cameraError}</div>
                  )}

                  {/* ── Idle placeholder ── */}
                  {phase === 'idle' && !cameraError && (
                    <div className="camera-placeholder">
                      <Video size={32} color="#bbb" />
                      <p>اضغط زر تشغيل الكاميرا للبدء</p>
                    </div>
                  )}

                  {/* ── Live video (preview / pre / recording) ── */}
                  {showVideo && (
                    <div className="camera-feed-wrap">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-video camera-mirror"
                      />

                      {/* Expected sign badge */}
                      {question.expectedSign && (
                        <div className="expected-sign-badge">
                          <span>الإشارة:</span>
                          <strong>{question.expectedSign}</strong>
                        </div>
                      )}

                      {/* Phase: pre — 3-2-1 get-ready overlay */}
                      {phase === 'pre' && (
                        <div className="camera-overlay pre-overlay">
                          <span className="pre-label">استعد...</span>
                          <div className="pre-count">{preCount || '!'}</div>
                        </div>
                      )}

                      {/* Phase: recording — red dot + 5-second countdown */}
                      {phase === 'recording' && (
                        <div className="camera-overlay">
                          <div className="rec-dot" />
                          <div className="rec-countdown">{recCount}</div>
                          <span className="rec-label">جاري التسجيل...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Done state ── */}
                  {phase === 'done' && (
                    <div className="camera-done">
                      <div className="camera-done-icon">✓</div>
                      <p>تم التسجيل بنجاح</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recording progress bar */}
            {phase === 'recording' && (
              <div className="rec-progress-wrap">
                <div className="rec-progress-bar" style={{ width: `${recProgressPct}%` }} />
              </div>
            )}

            {/* ── Buttons by phase ── */}

            {/* idle / error → open camera */}
            {phase === 'idle' && (
              <button className="nexttt-btn" onClick={openCamera}>
                <Video size={18} />
                <p>تشغيل الكاميرا</p>
              </button>
            )}

            {/* preview → start 3-2-1 + retry camera */}
            {phase === 'preview' && (
              <div className="rec-action-row">
                <button className="prev-btn" onClick={openCamera}>
                  <RotateCcw size={14} /> ضبط الكاميرا
                </button>
                <button className="nexttt-btn" onClick={startPreCountdown}>
                  <Play size={16} />
                  <p>ابدأ التسجيل</p>
                </button>
              </div>
            )}

            {/* pre-countdown — disabled */}
            {phase === 'pre' && (
              <button className="nexttt-btn" disabled style={{ opacity: 0.55, cursor: 'not-allowed' }}>
                <span className="rec-spinner" />
                <p>استعد... {preCount}</p>
              </button>
            )}

            {/* recording — disabled */}
            {phase === 'recording' && (
              <button className="nexttt-btn" disabled style={{ opacity: 0.55, cursor: 'not-allowed' }}>
                <span className="rec-spinner" />
                <p>جاري التسجيل... {recCount}s</p>
              </button>
            )}

            {/* done → retry or confirm */}
            {phase === 'done' && (
              <div className="rec-action-row">
                <button className="prev-btn" onClick={openCamera}>
                  <RotateCcw size={14} /> إعادة المحاولة
                </button>
                <button className="nextt-btn" onClick={() => setShowModal(true)}>
                  تأكيد الإجابة
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div className="overlay">
          <div className="success-modal">
            <img src={isLastQuestion ? congratulation : confirmanswer} alt="success" />
            <h2>{isLastQuestion ? 'تهانينا!' : 'تم تأكيد الإجابة'}</h2>
            <p>
              {isLastQuestion
                ? 'تم الانتهاء من الامتحان بنجاح.'
                : 'رائع! تقدر دلوقتي تنتقل للسؤال اللي بعده'}
            </p>
            <button
              className="modal-btn"
              disabled={mutation.isPending}
              onClick={() => { setShowModal(false); goNext(); }}
            >
              {mutation.isPending ? 'جاري الإرسال...' : isLastQuestion ? 'عرض النتيجة' : 'السؤال التالي'}
            </button>
          </div>
        </div>
      )}

      {mutation.isError && (
        <div className="quiz-error">حدث خطأ أثناء إرسال الإجابات. حاول مرة أخرى.</div>
      )}
    </>
  );
}
