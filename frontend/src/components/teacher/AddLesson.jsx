import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";

import { createLesson, getAllLessons, updateLesson } from "../../api/lessonApi";
import { createQuiz, createQuestion } from "../../api/quizApi";
import { getAllLevels, createLevel } from "../../api/levelApi";
import { createNotification } from "../../api/notificationApi";
import { makeQuestion } from "./lesson/QuestionCard";

import LessonInfoCard from "./lesson/LessonInfoCard";
import VideoCard from "./lesson/VideoCard";
import ThumbnailCard from "./lesson/ThumbnailCard";
import QuizCard from "./lesson/QuizCard";

// ── Validation schema ──
const schema = z.object({
  title: z.string().min(1, "من فضلك أدخل عنوان الدرس"),
  videoUrl: z
    .string()
    .min(1, "من فضلك أدخل رابط الفيديو")
    .url("رابط الفيديو غير صحيح"),
  levelId: z.string().min(1, "من فضلك اختر المستوى أو أنشئ مستوى جديداً"),
  lessonOrder: z.coerce
    .number({ invalid_type_error: "أدخل رقماً صحيحاً" })
    .int()
    .min(1, "الترتيب يجب أن يكون 1 أو أكثر"),
  description: z.string().optional(),
  duration: z.string().optional(),
  thumbnailUrl: z
    .union([z.string().url("رابط الصورة غير صحيح"), z.literal("")])
    .optional(),
});

export default function AddLesson({ redirectTo = "/Dashboard" }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Level state ──
  const [levelMode, setLevelMode] = useState("existing");
  const [newLevelTitle, setNewLevelTitle] = useState("");
  const [newLevelOrder, setNewLevelOrder] = useState("");

  // ── Quiz state ──
  const [quizEnabled, setQuizEnabled] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([makeQuestion()]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Data fetching ──
  const { data: levelsData } = useQuery({
    queryKey: ["levels"],
    queryFn: getAllLevels,
  });
  const levels = [...(levelsData?.data?.data?.data || [])].sort(
    (a, b) => a.levelOrder - b.levelOrder
  );

  // ── Form ──
  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm({
      resolver: zodResolver(schema),
      defaultValues: { lessonOrder: 1 },
    });

  const videoUrl = watch("videoUrl") || "";
  const thumbnailUrl = watch("thumbnailUrl") || "";
  const selectedLevelId = watch("levelId");

  // Auto-calculate next lesson order when a level is selected
  const { data: levelLessonsData, isSuccess: levelLessonsSuccess } = useQuery({
    queryKey: ["lesson-count-for-order", selectedLevelId],
    queryFn: () => getAllLessons({ levelId: selectedLevelId, limit: 100 }),
    enabled:
      !!selectedLevelId &&
      selectedLevelId !== "new" &&
      levelMode === "existing",
  });

  useEffect(() => {
    if (
      levelMode !== "existing" ||
      !selectedLevelId ||
      selectedLevelId === "new" ||
      !levelLessonsSuccess
    )
      return;
    const lessons = levelLessonsData?.data?.data?.data || [];
    const maxOrder =
      lessons.length > 0
        ? Math.max(...lessons.map((l) => l.lessonOrder || 0))
        : 0;
    setValue("lessonOrder", maxOrder + 1, { shouldValidate: false });
  }, [levelLessonsData, levelLessonsSuccess, selectedLevelId, levelMode, setValue]);

  // Sync hidden levelId field when toggling between existing / new
  const handleLevelModeSwitch = (mode) => {
    setLevelMode(mode);
    setValue("levelId", mode === "new" ? "new" : "", { shouldValidate: false });
  };

  // ── Inline validation helpers ──
  const validateNewLevel = () => {
    if (!newLevelTitle.trim()) {
      toast.error("من فضلك أدخل اسم المستوى الجديد");
      return false;
    }
    if (!Number(newLevelOrder) || Number(newLevelOrder) < 1) {
      toast.error("من فضلك أدخل ترتيب المستوى");
      return false;
    }
    return true;
  };

  const validateQuiz = () => {
    if (!quizTitle.trim()) {
      toast.error("من فضلك أدخل عنوان الاختبار");
      return false;
    }
    for (const q of questions) {
      if (!q.text.trim()) { toast.error("من فضلك أدخل نص كل سؤال"); return false; }
      if (q.type === "mcq") {
        if (q.options.some((o) => !o.text.trim())) { toast.error("من فضلك أدخل نص كل خيار"); return false; }
        if (!q.options.some((o) => o.isCorrect)) { toast.error("من فضلك حدد الإجابة الصحيحة لكل سؤال"); return false; }
      }
      if (q.type === "ai-practice" && !q.expectedSign.trim()) {
        toast.error("من فضلك أدخل الإشارة المتوقعة لأسئلة تدريب الذكاء الاصطناعي");
        return false;
      }
    }
    return true;
  };

  // ── Submit ──
  const onSubmit = async (data) => {
    if (!data.thumbnailUrl) delete data.thumbnailUrl;
    if (levelMode === "new" && !validateNewLevel()) return;
    if (quizEnabled && !validateQuiz()) return;

    setIsSubmitting(true);
    try {
      // 1. Create new level if needed
      let levelId = data.levelId;
      if (levelMode === "new") {
        const levelRes = await createLevel({
          title: newLevelTitle.trim(),
          levelOrder: Number(newLevelOrder),
        });
        levelId = levelRes.data?.data?.data?._id ?? levelRes.data?.data?._id;
      }

      // 2. Shift existing lessons if the chosen order is already taken
      if (levelMode === "existing") {
        const existing = levelLessonsData?.data?.data?.data || [];
        const chosenOrder = Number(data.lessonOrder);
        const toShift = existing
          .filter((l) => l.lessonOrder >= chosenOrder)
          .sort((a, b) => b.lessonOrder - a.lessonOrder);
        for (const lesson of toShift) {
          await updateLesson(lesson._id, { lessonOrder: lesson.lessonOrder + 1 });
        }
      }

      // 3. Create lesson
      const lessonRes = await createLesson({ ...data, levelId });
      const lessonId = lessonRes.data?.data?.data?._id ?? lessonRes.data?.data?._id;

      // 4. Optionally create quiz + questions
      if (quizEnabled && questions.length > 0 && lessonId) {
        const quizRes = await createQuiz({ title: quizTitle, lessonId });
        const quizId = quizRes.data?.data?.data?._id ?? quizRes.data?.data?._id;
        if (quizId) {
          await Promise.all(
            questions.map((q) =>
              createQuestion(quizId, {
                questionText: q.text,
                questionType: q.type,
                marks: q.marks,
                options: q.type === "ai-practice" ? [] : q.options,
                ...(q.type === "ai-practice" && { expectedSign: q.expectedSign }),
                ...(q.imageUrl?.trim() && { imageUrl: q.imageUrl.trim() }),
              })
            )
          );
        }
      }

      // 5. Notify students about the new lesson
      try {
        await createNotification({
          type: "lesson",
          message: `تم إضافة درس جديد: ${data.title}`,
          link: lessonId ? `/Learnnow/${lessonId}` : undefined,
        });
      } catch (_) {
        // Notification failure must not block the main flow
      }

      toast.success("تم إضافة الدرس بنجاح");
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["mc-levels"] });
      queryClient.invalidateQueries({ queryKey: ["mc-lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-count-for-order"] });
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ في إضافة الدرس");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-11 h-11 bg-orange-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">إضافة درس جديد</h1>
            <p className="text-sm text-gray-500">أكمل البيانات أدناه لإنشاء درس للطلاب</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <LessonInfoCard
            register={register}
            errors={errors}
            setValue={setValue}
            levels={levels}
            levelMode={levelMode}
            onLevelModeSwitch={handleLevelModeSwitch}
            newLevelTitle={newLevelTitle}
            setNewLevelTitle={setNewLevelTitle}
            newLevelOrder={newLevelOrder}
            setNewLevelOrder={setNewLevelOrder}
          />

          <VideoCard
            register={register}
            errors={errors}
            videoUrl={videoUrl}
          />

          <ThumbnailCard
            register={register}
            errors={errors}
            setValue={setValue}
            thumbnailUrl={thumbnailUrl}
          />

          <QuizCard
            quizEnabled={quizEnabled}
            setQuizEnabled={setQuizEnabled}
            quizTitle={quizTitle}
            setQuizTitle={setQuizTitle}
            questions={questions}
            setQuestions={setQuestions}
          />

          {/* ── Action buttons ── */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pb-6">
            <button
              type="button"
              onClick={() => navigate(redirectTo)}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#EB6837] text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors shadow-sm"
            >
              {isSubmitting ? "جاري النشر..." : "نشر الدرس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}