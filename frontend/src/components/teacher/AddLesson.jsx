// import "../styles/login.css";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { createLesson, getAllLessons, updateLesson } from "../../api/lessonApi";
// import { createQuiz, createQuestion } from "../../api/quizApi";
// import { getAllLevels, createLevel } from "../../api/levelApi";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { Trash2, Plus, ImageIcon } from "lucide-react";

// const schema = z.object({
//   title: z.string().min(1, "من فضلك أدخل عنوان الدرس"),
//   videoUrl: z.string().min(1, "من فضلك أدخل رابط الفيديو").url("رابط الفيديو غير صحيح"),
//   // levelId accepts "new" (when creating a new level) or a real ObjectId
//   levelId: z.string().min(1, "من فضلك اختر المستوى أو أنشئ مستوى جديداً"),
//   lessonOrder: z.coerce.number({ invalid_type_error: "أدخل رقماً صحيحاً" }).int().min(1, "الترتيب يجب أن يكون 1 أو أكثر"),
//   description: z.string().optional(),
//   duration: z.string().optional(),
//   thumbnailUrl: z.union([
//     z.string().url("رابط الصورة غير صحيح"),
//     z.literal(''),
//   ]).optional(),
// });

// // ── YouTube ID extractor ──
// function getYouTubeId(url) {
//   if (!url) return null;
//   const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
//   return m ? m[1] : null;
// }

// // ── Video Preview ──
// function VideoPreview({ url }) {
//   if (!url) return null;
//   const ytId = getYouTubeId(url);
//   if (ytId) {
//     return (
//       <div className="url-preview-box">
//         <iframe
//           className="url-preview-video"
//           src={`https://www.youtube.com/embed/${ytId}`}
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           title="معاينة الفيديو"
//         />
//       </div>
//     );
//   }
//   return (
//     <div className="url-preview-box">
//       <video className="url-preview-video" controls src={url}>
//         <p className="preview-error">المتصفح لا يدعم تشغيل هذا الفيديو</p>
//       </video>
//     </div>
//   );
// }

// // ── Image Preview ──
// // key={url} is passed from parent so error state resets automatically on URL change
// function ImagePreview({ url }) {
//   const [error, setError] = useState(false);

//   // Reset error if url changes while component stays mounted
//   useEffect(() => {
//     setError(false);
//   }, [url]);

//   if (!url) return null;
//   if (error) {
//     return (
//       <div className="url-preview-box preview-error-box">
//         <p className="preview-error">تعذّر تحميل الصورة — تحقق من الرابط</p>
//       </div>
//     );
//   }
//   return (
//     <div className="url-preview-box">
//       <img
//         className="url-preview-img"
//         src={url}
//         alt="معاينة الصورة"
//         onError={() => setError(true)}
//         onLoad={() => setError(false)}
//       />
//     </div>
//   );
// }

// // ── Question types ──
// const Q_TYPES = [
//   { value: 'mcq', label: 'اختيار متعدد' },
//   { value: 'true-false', label: 'صح / خطأ' },
//   { value: 'ai-practice', label: 'تدريب AI' },
// ];

// function makeQuestion() {
//   return {
//     id: crypto.randomUUID(),
//     type: 'mcq',
//     text: '',
//     marks: 1,
//     imageUrl: '',
//     expectedSign: '',
//     options: [
//       { text: '', isCorrect: true },
//       { text: '', isCorrect: false },
//     ],
//   };
// }

// // ── Question Card ──
// function QuestionCard({ q, idx, onChange, onDelete }) {
//   const handleTypeChange = (type) => {
//     let options = q.options;
//     if (type === 'true-false') {
//       options = [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }];
//     } else if (type === 'ai-practice') {
//       options = [];
//     } else if (q.type !== 'mcq') {
//       options = [{ text: '', isCorrect: true }, { text: '', isCorrect: false }];
//     }
//     onChange({ ...q, type, options });
//   };

//   const setCorrect = (i) =>
//     onChange({ ...q, options: q.options.map((o, oi) => ({ ...o, isCorrect: oi === i })) });

//   const setOptionText = (i, text) =>
//     onChange({ ...q, options: q.options.map((o, oi) => oi === i ? { ...o, text } : o) });

//   const addOption = () =>
//     onChange({ ...q, options: [...q.options, { text: '', isCorrect: false }] });

//   const removeOption = (i) => {
//     const options = q.options.filter((_, oi) => oi !== i);
//     if (!options.some(o => o.isCorrect) && options.length > 0) options[0].isCorrect = true;
//     onChange({ ...q, options });
//   };

//   return (
//     <div className="qcard" dir="rtl">
//       <div className="qcard-header">
//         <span className="qcard-num">السؤال {idx + 1}</span>
//         <button type="button" className="qcard-delete" onClick={onDelete} title="حذف السؤال">
//           <Trash2 size={16} />
//         </button>
//       </div>

//       <input
//         type="text"
//         className="form-input"
//         placeholder="اكتب نص السؤال هنا..."
//         value={q.text}
//         onChange={(e) => onChange({ ...q, text: e.target.value })}
//         style={{ marginBottom: '12px' }}
//       />

//       <div className="qcard-meta-row">
//         <div className="qcard-type-tabs">
//           {Q_TYPES.map(t => (
//             <button
//               key={t.value}
//               type="button"
//               className={`qcard-type-tab${q.type === t.value ? ' active' : ''}`}
//               onClick={() => handleTypeChange(t.value)}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>
//         <div className="qcard-marks-row">
//           <label className="form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>الدرجة</label>
//           <input
//             type="number"
//             min="1"
//             className="quiz-marks-input"
//             value={q.marks}
//             onChange={(e) => onChange({ ...q, marks: Math.max(1, Number(e.target.value) || 1) })}
//           />
//         </div>
//       </div>

//       {/* MCQ */}
//       {q.type === 'mcq' && (
//         <div className="qcard-options">
//           {q.options.map((opt, i) => (
//             <div key={i} className="qcard-opt-row">
//               <input
//                 type="radio"
//                 name={`correct-${q.id}`}
//                 checked={opt.isCorrect}
//                 onChange={() => setCorrect(i)}
//                 className="exam-radio"
//                 title="الإجابة الصحيحة"
//               />
//               <input
//                 type="text"
//                 className="option-input"
//                 placeholder={`الخيار ${i + 1}`}
//                 value={opt.text}
//                 onChange={(e) => setOptionText(i, e.target.value)}
//               />
//               {q.options.length > 2 && (
//                 <button type="button" className="delete-option" onClick={() => removeOption(i)}>
//                   <Trash2 size={14} />
//                 </button>
//               )}
//             </div>
//           ))}
//           {q.options.length < 6 && (
//             <button type="button" className="add-option" onClick={addOption}>
//               <Plus size={14} style={{ marginLeft: '4px' }} />
//               إضافة خيار
//             </button>
//           )}
//         </div>
//       )}

//       {/* True / False */}
//       {q.type === 'true-false' && (
//         <div className="qcard-options">
//           {q.options.map((opt, i) => (
//             <div key={i} className="qcard-opt-row">
//               <input
//                 type="radio"
//                 name={`correct-${q.id}`}
//                 checked={opt.isCorrect}
//                 onChange={() => setCorrect(i)}
//                 className="exam-radio"
//                 title="الإجابة الصحيحة"
//               />
//               <span className="option-input tf-opt">{opt.text}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Question image — MCQ & True/False only */}
//       {(q.type === 'mcq' || q.type === 'true-false') && (
//         <div className="qcard-image-section">
//           <label className="qcard-image-label">
//             <ImageIcon size={13} />
//             صورة السؤال
//             <span className="form-optional"> (اختياري)</span>
//           </label>
//           <input
//             type="url"
//             className="option-input"
//             placeholder="https://... أدخل رابط صورة السؤال"
//             value={q.imageUrl || ''}
//             onChange={(e) => onChange({ ...q, imageUrl: e.target.value })}
//           />
//           {q.imageUrl && (
//             <div className="qcard-image-preview">
//               <img
//                 src={q.imageUrl}
//                 alt="معاينة صورة السؤال"
//                 onError={(e) => { e.target.style.display = 'none'; }}
//                 onLoad={(e) => { e.target.style.display = 'block'; }}
//               />
//             </div>
//           )}
//         </div>
//       )}

//       {/* AI Practice */}
//       {q.type === 'ai-practice' && (
//         <div className="qcard-options">
//           <p className="ai-practice-hint">
//             سيتم تقييم إجابة الطالب تلقائياً بواسطة الذكاء الاصطناعي بناءً على نص السؤال
//           </p>
//           <div className="form-section" style={{ marginTop: '10px' }}>
//             <label className="form-label">الإشارة المتوقعة <span className="form-optional">(الكلمة أو الحرف المطلوب)</span></label>
//             <input
//               type="text"
//               className="form-input"
//               placeholder="مثال: مرحبا، أ، شكراً..."
//               value={q.expectedSign}
//               onChange={(e) => onChange({ ...q, expectedSign: e.target.value })}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main component ──
// export default function AddLesson({ redirectTo = "/Dashboard" }) {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // Level mode: 'existing' = select from list, 'new' = create a new level
//   const [levelMode, setLevelMode] = useState('existing');
//   const [newLevelTitle, setNewLevelTitle] = useState('');
//   const [newLevelOrder, setNewLevelOrder] = useState('');

//   const [quizEnabled, setQuizEnabled] = useState(false);
//   const [quizTitle, setQuizTitle] = useState('');
//   const [questions, setQuestions] = useState([makeQuestion()]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: levelsData } = useQuery({
//     queryKey: ['levels'],
//     queryFn: getAllLevels,
//   });
//   const levels = [...(levelsData?.data?.data?.data || [])].sort((a, b) => a.levelOrder - b.levelOrder);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: { lessonOrder: 1 },
//   });

//   const videoUrl = watch('videoUrl') || '';
//   const thumbnailUrl = watch('thumbnailUrl') || '';
//   const selectedLevelId = watch('levelId');

//   // Fetch existing lessons for the selected level to auto-calculate next lessonOrder
//   const { data: levelLessonsData, isSuccess: levelLessonsSuccess } = useQuery({
//     queryKey: ['lesson-count-for-order', selectedLevelId],
//     queryFn: () => getAllLessons({ levelId: selectedLevelId, limit: 100 }),
//     enabled: !!selectedLevelId && selectedLevelId !== 'new' && levelMode === 'existing',
//   });

//   useEffect(() => {
//     if (levelMode !== 'existing' || !selectedLevelId || selectedLevelId === 'new') return;
//     if (!levelLessonsSuccess) return; // wait until we have data for the current level
//     const lessons = levelLessonsData?.data?.data?.data || [];
//     const maxOrder = lessons.length > 0 ? Math.max(...lessons.map((l) => l.lessonOrder || 0)) : 0;
//     setValue('lessonOrder', maxOrder + 1, { shouldValidate: false });
//   }, [levelLessonsData, levelLessonsSuccess, selectedLevelId, levelMode, setValue]);

//   // When switching level mode, keep the hidden levelId field in sync so zod validation passes
//   const handleLevelModeSwitch = (mode) => {
//     setLevelMode(mode);
//     if (mode === 'new') {
//       setValue('levelId', 'new', { shouldValidate: false });
//     } else {
//       setValue('levelId', '', { shouldValidate: false });
//     }
//   };

//   const onSubmit = async (data) => {
//     if (!data.thumbnailUrl) delete data.thumbnailUrl;

//     // ── Shift existing lessons if chosen order is already taken ──
//     if (levelMode === 'existing') {
//       const existingLessons = levelLessonsData?.data?.data?.data || [];
//       const chosenOrder = Number(data.lessonOrder);
//       const toShift = existingLessons
//         .filter((l) => l.lessonOrder >= chosenOrder)
//         .sort((a, b) => b.lessonOrder - a.lessonOrder); // descending to avoid unique index conflicts
//       for (const lesson of toShift) {
//         await updateLesson(lesson._id, { lessonOrder: lesson.lessonOrder + 1 });
//       }
//     }

//     // ── Validate new level fields ──
//     if (levelMode === 'new') {
//       if (!newLevelTitle.trim()) {
//         toast.error('من فضلك أدخل اسم المستوى الجديد');
//         return;
//       }
//       const order = Number(newLevelOrder);
//       if (!order || order < 1) {
//         toast.error('من فضلك أدخل ترتيب المستوى');
//         return;
//       }
//     }

//     // ── Validate quiz fields ──
//     if (quizEnabled) {
//       if (!quizTitle.trim()) { toast.error('من فضلك أدخل عنوان الاختبار'); return; }
//       for (const q of questions) {
//         if (!q.text.trim()) { toast.error('من فضلك أدخل نص كل سؤال'); return; }
//         if (q.type === 'mcq') {
//           if (q.options.some(o => !o.text.trim())) { toast.error('من فضلك أدخل نص كل خيار'); return; }
//           if (!q.options.some(o => o.isCorrect)) { toast.error('من فضلك حدد الإجابة الصحيحة لكل سؤال'); return; }
//         }
//         if (q.type === 'ai-practice' && !q.expectedSign.trim()) {
//           toast.error('من فضلك أدخل الإشارة المتوقعة لأسئلة تدريب الذكاء الاصطناعي');
//           return;
//         }
//       }
//     }

//     setIsSubmitting(true);
//     try {
//       // Step 1: create new level if needed
//       let levelId = data.levelId;
//       if (levelMode === 'new') {
//         const levelRes = await createLevel({
//           title: newLevelTitle.trim(),
//           levelOrder: Number(newLevelOrder),
//         });
//         levelId = levelRes.data?.data?.data?._id ?? levelRes.data?.data?._id;
//       }

//       // Step 2: create lesson
//       const lessonRes = await createLesson({ ...data, levelId });
//       const lessonId = lessonRes.data?.data?.data?._id ?? lessonRes.data?.data?._id;

//       // Step 3: create quiz + questions
//       if (quizEnabled && questions.length > 0 && lessonId) {
//         const quizRes = await createQuiz({ title: quizTitle, lessonId });
//         const quizId = quizRes.data?.data?.data?._id ?? quizRes.data?.data?._id;
//         if (quizId) {
//           await Promise.all(
//             questions.map((q) =>
//               createQuestion(quizId, {
//                 questionText: q.text,
//                 questionType: q.type,
//                 marks: q.marks,
//                 options: q.type === 'ai-practice' ? [] : q.options,
//                 ...(q.type === 'ai-practice' && { expectedSign: q.expectedSign }),
//                 ...(q.imageUrl?.trim() && { imageUrl: q.imageUrl.trim() }),
//               })
//             )
//           );
//         }
//       }

//       toast.success('تم إضافة الدرس بنجاح');
//       queryClient.invalidateQueries({ queryKey: ['teacher-dashboard'] });
//       queryClient.invalidateQueries({ queryKey: ['mc-levels'] });
//       queryClient.invalidateQueries({ queryKey: ['mc-lessons'] });
//       queryClient.invalidateQueries({ queryKey: ['lesson-count-for-order'] });
//       navigate(redirectTo);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'حدث خطأ في إضافة الدرس');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const updateQuestion = (id, updated) =>
//     setQuestions(qs => qs.map(q => q.id === id ? updated : q));

//   const deleteQuestion = (id) =>
//     setQuestions(qs => qs.filter(q => q.id !== id));

//   return (
//     <div className="lesson-container" dir="rtl">
//       <div className="lesson-header" style={{ padding: '24px 24px 0' }}>
//         <h1 className="lesson-title">إضافة درس جديد</h1>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="lesson-form">
//                 {/* ── Thumbnail URL + Live Preview ── */}
// <div className="form-section">
//   <label className="form-label">
//     رفع صورة الدرس <span className="form-optional">(اختياري)</span>
//   </label>

//   {/* URL input */}
//   <input
//     type="url"
//     placeholder="https://example.com/thumbnail.jpg"
//     className="form-input"
//     {...register("thumbnailUrl")}
//   />

//   {/* File upload input */}
//   <input
//     type="file"
//     accept="image/*"
//     className="form-input"
//     onChange={(e) => {
//       const file = e.target.files[0];
//       if (!file) return;
//       const reader = new FileReader();
//       reader.onload = () => {
//         setValue("thumbnailUrl", reader.result, { shouldValidate: true });
//       };
//       reader.readAsDataURL(file); // يحول الصورة إلى base64 للمعاينة
//     }}
//   />

//   {/* معاينة الصورة */}
//   {thumbnailUrl && <ImagePreview url={thumbnailUrl} />}
// </div>
//         {/* ── Row 1: Title + Level ── */}
//         <div className="form-row">
//           {/* Title */}
//           <div className="form-section">
//             <label className="form-label">عنوان الدرس</label>
//             <input
//               type="text"
//               placeholder="أدخل عنوان الدرس"
//               className="form-input"
//               {...register("title")}
//             />
//             {errors.title && <p className="form-error">{errors.title.message}</p>}
//           </div>

//         {/* ── Description ── */}
//         <div className="form-section">
//           <label className="form-label">
//             وصف الدرس <span className="form-optional">(اختياري)</span>
//           </label>
//           <textarea
//             placeholder="أدخل وصف الدرس"
//             className="form-textarea"
//             rows={3}
//             {...register("description")}
//           />
//         </div>

//           {/* Level — with mode toggle */}
//           <div className="form-section">
//             <div className="level-mode-header">
//               <label className="form-label" style={{ margin: 0 }}>المستوى</label>
//               <div className="level-mode-toggle">
//                 <button
//                   type="button"
//                   className={`level-mode-btn${levelMode === 'existing' ? ' active' : ''}`}
//                   onClick={() => handleLevelModeSwitch('existing')}
//                 >
//                   موجود
//                 </button>
//                 <button
//                   type="button"
//                   className={`level-mode-btn${levelMode === 'new' ? ' active' : ''}`}
//                   onClick={() => handleLevelModeSwitch('new')}
//                 >
//                   + مستوى جديد
//                 </button>
//               </div>
//             </div>

//             {/* Hidden field to satisfy zod's levelId validation */}
//             <input type="hidden" {...register("levelId")} />

//             {levelMode === 'existing' ? (
//               <select
//                 className="form-select"
//                 onChange={(e) => setValue('levelId', e.target.value, { shouldValidate: true })}
//                 defaultValue=""
//               >
//                 <option value="">اختر المستوى</option>
//                 {levels.map((lvl) => (
//                   <option key={lvl._id} value={lvl._id}>{lvl.title}</option>
//                 ))}
//               </select>
//             ) : (
//               <div className="new-level-fields">
//                 <input
//                   type="text"
//                   placeholder="اسم المستوى الجديد"
//                   className="form-input"
//                   value={newLevelTitle}
//                   onChange={(e) => setNewLevelTitle(e.target.value)}
//                 />
//                 <input
//                   type="number"
//                   min="1"
//                   placeholder="ترتيب المستوى (مثال: 4)"
//                   className="form-input"
//                   value={newLevelOrder}
//                   onChange={(e) => setNewLevelOrder(e.target.value)}
//                 />
//               </div>
//             )}

//             {errors.levelId && levelMode === 'existing' && (
//               <p className="form-error">{errors.levelId.message}</p>
//             )}
//           </div>
//         </div>

//         {/* ── Row 2: Order + Duration ── */}
//         <div className="form-row">
//           <div className="form-section">
//             <label className="form-label">ترتيب الدرس</label>
//             <input
//               type="number"
//               min="1"
//               className="form-input"
//               {...register("lessonOrder")}
//             />
//             {errors.lessonOrder && <p className="form-error">{errors.lessonOrder.message}</p>}
//           </div>
//           <div className="form-section">
//             <label className="form-label">
//               مدة الفيديو <span className="form-optional">(اختياري)</span>
//             </label>
//             <input
//               type="text"
//               placeholder="مثال: 12:30"
//               className="form-input"
//               {...register("duration")}
//             />
//           </div>
//         </div>

//         {/* ── Description ── */}
//         <div className="form-section">
//           <label className="form-label">
//             نبذة عن الدرس<span className="form-optional">(اختياري)</span>
//           </label>
//           <textarea
//             placeholder="ادخل نبذة عن الدرس"
//             className="form-textarea"
//             rows={3}
//           />
//         </div>

//         {/* ── Video URL + Live Preview ── */}
//         <div className="form-section">
//           <label className="form-label">رابط الفيديو</label>
//           <input
//             type="url"
//             placeholder="https://www.youtube.com/watch?v=... أو رابط MP4 مباشر"
//             className="form-input"
//             {...register("videoUrl")}
//           />
//           {errors.videoUrl && <p className="form-error">{errors.videoUrl.message}</p>}
//           <VideoPreview url={videoUrl} />
//         </div>

//         {/* ── Quiz Section ── */}
//         <div className="quiz-section">
//           <div className="quiz-toggle-row">
//             <div>
//               <p className="quiz-toggle-label">إضافة اختبار للدرس</p>
//               <p className="quiz-toggle-hint">أضف أسئلة الاختبار مباشرةً أثناء إنشاء الدرس</p>
//             </div>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={quizEnabled}
//                 onChange={(e) => setQuizEnabled(e.target.checked)}
//               />
//               <span className="slider" />
//             </label>
//           </div>

//           {quizEnabled && (
//             <div className="quiz-body">
//               <div className="form-section">
//                 <label className="form-label">عنوان الاختبار</label>
//                 <input
//                   type="text"
//                   placeholder="مثال: اختبار الدرس الأول"
//                   className="form-input"
//                   value={quizTitle}
//                   onChange={(e) => setQuizTitle(e.target.value)}
//                 />
//               </div>

//               <div className="questions-list" style={{ marginTop: '4px' }}>
//                 {questions.map((q, i) => (
//                   <QuestionCard
//                     key={q.id}
//                     q={q}
//                     idx={i}
//                     onChange={(updated) => updateQuestion(q.id, updated)}
//                     onDelete={() => deleteQuestion(q.id)}
//                   />
//                 ))}
//               </div>

//               <button
//                 type="button"
//                 className="add-qcard-btn"
//                 onClick={() => setQuestions(qs => [...qs, makeQuestion()])}
//               >
//                 <Plus size={16} />
//                 إضافة سؤال جديد
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── Submit Buttons ── */}
//         <div className="form-buttons">
//           <button type="submit" className="btn-submit" disabled={isSubmitting}>
//             {isSubmitting ? "جاري النشر..." : "نشر الدرس"}
//           </button>
//           <button type="button" className="btn-cancel" onClick={() => navigate(redirectTo)}>
//             إلغاء
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



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
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors shadow-sm"
            >
              {isSubmitting ? "جاري النشر..." : "نشر الدرس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}