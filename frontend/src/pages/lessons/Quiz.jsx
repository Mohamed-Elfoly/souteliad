import { useState, useRef, useEffect } from "react";
import confirmanswer from "../../assets/images/confirmanswer.png";
import congratulation from "../../assets/images/congratulation.png";
import { ChevronLeft, Play, RotateCcw, Video, Info } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQuestions, submitQuizAttempt } from "../../api/quizApi";

const QUESTION_TITLES = [
  'السؤال الأول', 'السؤال الثاني', 'السؤال الثالث', 'السؤال الرابع',
  'السؤال الخامس', 'السؤال السادس', 'السؤال السابع', 'السؤال الثامن',
  'السؤال التاسع', 'السؤال العاشر',
];

const PRE_SECONDS = 3;
const REC_SECONDS = 5;

export default function Quiz() {
  const { quizId }  = useParams();
  const navigate    = useNavigate();
  const { lessonId, levelId } = useLocation().state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers]           = useState({});
  const [showModal, setShowModal]       = useState(false);
  const [cameraError, setCameraError]   = useState(null);

  const [phase, setPhase]       = useState('idle');
  const [preCount, setPreCount] = useState(PRE_SECONDS);
  const [recCount, setRecCount] = useState(REC_SECONDS);

  const videoRef         = useRef(null);
  const streamRef        = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks   = useRef([]);
  const timerRef         = useRef(null);

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

  useEffect(() => {
    if ((phase === 'preview' || phase === 'pre' || phase === 'recording') &&
        videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  useEffect(() => {
    resetAll();
    setShowModal(false);
  }, [currentIndex]); // eslint-disable-line

  useEffect(() => () => stopAll(), []); // eslint-disable-line

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

  // ── Render guards ──────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="flex items-center justify-center py-16 text-gray-400 font-[Rubik]">
      جاري التحميل...
    </div>
  );

  if (!question) return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 px-6 text-center font-[Rubik]" dir="rtl">
      <div className="flex items-center justify-center w-18 h-18 bg-gray-100 rounded-full mb-2">
        <Info size={36} color="#6b7280" />
      </div>
      <h3 className="text-xl font-bold text-gray-700">لا توجد أسئلة في هذا الاختبار</h3>
      <p className="text-sm text-gray-500">هذا الاختبار لا يحتوي على أسئلة حالياً</p>
      <button
        className="mt-2 bg-transparent text-[#EB6837] border border-[#EB6837] px-7 py-3 rounded-full text-sm font-semibold cursor-pointer hover:bg-[#EB6837] hover:text-white transition-colors"
        onClick={() => navigate("/Lessons", { state: { levelId } })}
      >
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
    <div className="font-[Rubik]">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-1 px-15 py-3 text-sm text-gray-500" dir="rtl">
        <p className="text-[#EB6837] font-medium">الدرس</p>
        <ChevronLeft size={16} color="#EB6837" />
        <p className="text-[#EB6837] font-medium">اختبر مهاراتك الآن</p>
        <ChevronLeft size={16} color="#EB6837" />
        <p className="text-gray-600">{questionTitle}</p>
      </div>

      {/* ── Main card ── */}
      <div className="bg-white">
        <div className="max-w-[1240px] mx-auto min-h-screen px-6 py-6" dir="rtl">

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-[#EB6837] rounded-full transition-[width] duration-400"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-[#495055]">{questionTitle}</h2>
            <span className="text-lg text-[#868687]">
              {question.marks === 1 ? '1 درجة' : `${question.marks} درجات`}
            </span>
          </div>

          {/* ══ MCQ / True-False ══════════════════════════════════════════════ */}
          {!isPractical ? (
            <>
              <p className="text-center text-2xl font-bold text-[#373D41] my-4 mb-6">
                {question.questionText}
              </p>

              {/* Body: always two columns — image (or placeholder) + options */}
              <div className="grid grid-cols-[1fr_2fr] gap-10 items-center max-md:grid-cols-1">
                {/* Image or warm placeholder */}
                <div className="max-md:order-first flex justify-center">
                  {question.imageUrl ? (
                    <img
                      src={question.imageUrl}
                      alt=""
                      className="w-full max-w-[340px] h-auto rounded-2xl bg-[#FFF0CF]"
                    />
                  ) : (
                    <div className="w-full max-w-[340px] aspect-square bg-[#FFF0CF] rounded-2xl flex flex-col items-center justify-center gap-3 text-[#c9a96e]">
                      {/* Simple sign-language / hand illustration placeholder */}
                      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Palm */}
                        <rect x="30" y="45" width="40" height="38" rx="8" fill="#EB6837" opacity="0.25"/>
                        <rect x="30" y="45" width="40" height="38" rx="8" stroke="#EB6837" strokeWidth="2.5"/>
                        {/* Thumb */}
                        <rect x="16" y="52" width="16" height="10" rx="5" fill="#EB6837" opacity="0.25"/>
                        <rect x="16" y="52" width="16" height="10" rx="5" stroke="#EB6837" strokeWidth="2.5"/>
                        {/* Index finger */}
                        <rect x="33" y="27" width="10" height="22" rx="5" fill="#EB6837" opacity="0.25"/>
                        <rect x="33" y="27" width="10" height="22" rx="5" stroke="#EB6837" strokeWidth="2.5"/>
                        {/* Middle finger */}
                        <rect x="45" y="22" width="10" height="27" rx="5" fill="#EB6837" opacity="0.25"/>
                        <rect x="45" y="22" width="10" height="27" rx="5" stroke="#EB6837" strokeWidth="2.5"/>
                        {/* Ring finger */}
                        <rect x="57" y="27" width="10" height="22" rx="5" fill="#EB6837" opacity="0.25"/>
                        <rect x="57" y="27" width="10" height="22" rx="5" stroke="#EB6837" strokeWidth="2.5"/>
                      </svg>
                      <span className="text-sm font-semibold text-[#EB6837]/70">صورة الإشارة</span>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="flex flex-col gap-4">
                  {(question.options || []).map((opt, index) => (
                    <label
                      key={index}
                      className={`flex justify-start items-center gap-3 px-4 py-3 rounded-lg cursor-pointer border-2 bg-white text-black transition-colors
                        ${selectedOptIdx === index
                          ? 'border-[#EB6837]'
                          : 'border-[#D1D1D6] hover:border-[#EB6837]/50'
                        }`}
                    >
                      <input
                        type="radio"
                        className="accent-[#EB6837] w-4 h-4"
                        checked={selectedOptIdx === index}
                        onChange={() => selectOption(index)}
                      />
                      <span className="text-base">{opt.text}</span>
                      
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 mt-6" dir="ltr">
                <button
                  className="bg-[#EB6837] text-white px-11 py-3.5 rounded-full text-xl font-bold cursor-pointer hover:bg-[#dc5727] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  onClick={goNext}
                  disabled={mutation.isPending || selectedOptIdx === null}
                >
                  {mutation.isPending ? 'جاري الإرسال...' : isLastQuestion ? 'إنهاء الاختبار' : 'التالي'}
                </button>
                {currentIndex > 0 && (
                  <button
                    className="bg-transparent text-[#373D41] border border-[#EB6837] px-10 py-2.5 rounded-full text-xl font-bold cursor-pointer hover:bg-[#EB6837] hover:text-white transition-colors"
                    onClick={() => setCurrentIndex((i) => i - 1)}
                  >
                    السابق
                  </button>
                )}
              </div>
            </>
          ) : (

          /* ══ AI Practice ══════════════════════════════════════════════════ */
            <>
              <p className="text-center text-2xl font-bold text-[#373D41] mb-0">
                {question.questionText}
              </p>

              <div className="bg-[#FEFEFE] py-10 px-5">
                <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center gap-15 flex-row-reverse flex-wrap px-5">

                  {/* Instructions */}
                  <div className="flex flex-col items-end gap-2.5 flex-1 text-right">
                    <p className="text-lg font-medium text-[#373D41] mb-2.5">
                      قم بأداء الإشارة المطلوبة أمام الكاميرا.
                    </p>
                    <h2 className="text-2xl font-bold text-[#373D41]">نص التعليمات:</h2>
                    <ol className="flex flex-col text-lg font-medium text-[#868687] leading-loose pr-5 list-decimal" dir="rtl">
                      <li>اضغط <strong>تشغيل الكاميرا</strong> وتأكد أنك واضح أمامها.</li>
                      <li>اضغط <strong>ابدأ التسجيل</strong> وانتظر العد التنازلي ٣ ثواني.</li>
                      <li>اعمل الإشارة المطلوبة بلغة الإشارة.</li>
                      <li>سيتم التسجيل تلقائياً لمدة ٥ ثواني ثم يتوقف.</li>
                    </ol>
                    <h3 className="text-2xl font-bold text-[#373D41]">ملاحظة:</h3>
                    <p className="text-lg font-medium text-[#868687]">
                      يتم استخدام الكاميرا فقط أثناء الامتحان لتقييم أداء لغة الإشارة،
                      ولا يتم حفظ أي فيديوهات أو صور بدون إذنك.
                    </p>
                  </div>

                  {/* Camera box */}
                  <div className="w-[350px] h-[300px] bg-[#E8D9B5] rounded-2xl flex justify-center items-center text-center p-0 overflow-hidden relative max-md:w-full max-md:max-w-[400px] max-md:h-[250px]">
                    {cameraError && (
                      <div className="text-red-500 text-sm text-center p-4" dir="rtl">
                        {cameraError}
                      </div>
                    )}

                    {/* Idle placeholder */}
                    {phase === 'idle' && !cameraError && (
                      <div className="flex flex-col items-center gap-2.5 p-6 text-gray-400 text-sm">
                        <Video size={32} color="#bbb" />
                        <p>اضغط زر تشغيل الكاميرا للبدء</p>
                      </div>
                    )}

                    {/* Live video */}
                    {showVideo && (
                      <div className="relative w-full h-full min-h-[220px]">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover rounded-2xl block scale-x-[-1]"
                        />

                        {/* Expected sign badge */}
                        {question.expectedSign && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#EB6837]/90 text-white rounded-full px-3.5 py-1 text-xs flex items-center gap-1.5 whitespace-nowrap backdrop-blur-sm pointer-events-none">
                            <span>الإشارة:</span>
                            <strong className="font-bold text-[0.88rem]">{question.expectedSign}</strong>
                          </div>
                        )}

                        {/* Pre countdown overlay */}
                        {phase === 'pre' && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-[#EB6837]/45 rounded-2xl pointer-events-none">
                            <span className="text-sm font-semibold text-white/95 tracking-wide drop-shadow">استعد...</span>
                            <div className="text-[5rem] font-black text-white leading-none drop-shadow-lg animate-[pre-pop_0.35s_cubic-bezier(.34,1.56,.64,1)]">
                              {preCount || '!'}
                            </div>
                          </div>
                        )}

                        {/* Recording overlay */}
                        {phase === 'recording' && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/35 rounded-2xl pointer-events-none">
                            <div className="absolute top-3.5 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <div className="text-5xl font-black text-white leading-none drop-shadow-lg z-10">
                              {recCount}
                            </div>
                            <span className="text-xs text-white/85 tracking-wide">جاري التسجيل...</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Done state */}
                    {phase === 'done' && (
                      <div className="flex flex-col items-center gap-2.5 p-5">
                        <div className="w-13 h-13 bg-green-500 rounded-full flex items-center justify-center text-2xl text-white font-bold animate-[done-pop_0.4s_cubic-bezier(.34,1.56,.64,1)]">
                          ✓
                        </div>
                        <p className="text-sm text-gray-500 font-semibold">تم التسجيل بنجاح</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recording progress bar */}
              {phase === 'recording' && (
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#EB6837] to-[#f5a37a] rounded-full transition-[width] duration-[0.9s] linear"
                    style={{ width: `${recProgressPct}%` }}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-5">
                {phase === 'idle' && (
                  <button
                    className="w-[301px] h-12 flex items-center justify-center gap-2.5 bg-[#EB6837] text-white rounded-full text-xl font-bold cursor-pointer mr-9 hover:bg-[#dc5727] transition-colors"
                    onClick={openCamera}
                  >
                    <Video size={18} />
                    <span>تشغيل الكاميرا</span>
                  </button>
                )}

                {phase === 'preview' && (
                  <div className="flex gap-3 items-center justify-end mt-1">
                    <button
                      className="bg-transparent text-[#373D41] border border-[#EB6837] px-10 py-2.5 rounded-full text-xl font-bold cursor-pointer flex items-center gap-1.5 hover:bg-[#EB6837] hover:text-white transition-colors"
                      onClick={openCamera}
                    >
                      <RotateCcw size={14} /> ضبط الكاميرا
                    </button>
                    <button
                      className="w-[301px] h-12 flex items-center justify-center gap-2.5 bg-[#EB6837] text-white rounded-full text-xl font-bold cursor-pointer hover:bg-[#dc5727] transition-colors"
                      onClick={startPreCountdown}
                    >
                      <Play size={16} />
                      <span>ابدأ التسجيل</span>
                    </button>
                  </div>
                )}

                {phase === 'pre' && (
                  <button
                    className="w-[301px] h-12 flex items-center justify-center gap-2.5 bg-[#EB6837] text-white rounded-full text-xl font-bold opacity-55 cursor-not-allowed mr-9"
                    disabled
                  >
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    <span>استعد... {preCount}</span>
                  </button>
                )}

                {phase === 'recording' && (
                  <button
                    className="w-[301px] h-12 flex items-center justify-center gap-2.5 bg-[#EB6837] text-white rounded-full text-xl font-bold opacity-55 cursor-not-allowed mr-9"
                    disabled
                  >
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    <span>جاري التسجيل... {recCount}s</span>
                  </button>
                )}

                {phase === 'done' && (
                  <div className="flex gap-3 items-center justify-end mt-1">
                    <button
                      className="bg-transparent text-[#373D41] border border-[#EB6837] px-10 py-2.5 rounded-full text-xl font-bold cursor-pointer flex items-center gap-1.5 hover:bg-[#EB6837] hover:text-white transition-colors"
                      onClick={openCamera}
                    >
                      <RotateCcw size={14} /> إعادة المحاولة
                    </button>
                    <button
                      className="bg-[#EB6837] text-white px-11 py-3.5 rounded-full text-xl font-bold cursor-pointer hover:bg-[#dc5727] transition-colors"
                      onClick={() => setShowModal(true)}
                    >
                      تأكيد الإجابة
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Confirmation modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="bg-[#f1f1f1] w-[90%] max-w-[500px] rounded-3xl p-10 text-center animate-[fadeIn_0.3s_ease-in-out]">
            <img
              src={isLastQuestion ? congratulation : confirmanswer}
              alt="success"
              className="w-[220px] mx-auto mb-5"
            />
            <h2 className="text-3xl font-bold mb-4">
              {isLastQuestion ? 'تهانينا!' : 'تم تأكيد الإجابة'}
            </h2>
            <p className="text-lg text-[#555] mb-6" dir="rtl">
              {isLastQuestion
                ? 'تم الانتهاء من الامتحان بنجاح.'
                : 'رائع! تقدر دلوقتي تنتقل للسؤال اللي بعده'}
            </p>
            <button
              className="bg-[#EB6837] text-white border-none px-8 py-3 rounded-full text-base cursor-pointer hover:bg-[#d8572c] transition-colors disabled:opacity-60"
              disabled={mutation.isPending}
              onClick={() => { setShowModal(false); goNext(); }}
            >
              {mutation.isPending ? 'جاري الإرسال...' : isLastQuestion ? 'عرض النتيجة' : 'السؤال التالي'}
            </button>
          </div>
        </div>
      )}

      {mutation.isError && (
        <div className="text-red-500 text-center p-4">
          حدث خطأ أثناء إرسال الإجابات. حاول مرة أخرى.
        </div>
      )}
    </div>
  );
}