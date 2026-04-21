import { useState } from 'react';
import {
  ChevronLeft, Trash2, BookOpen, Layers,
  HelpCircle, AlertTriangle, FolderOpen,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllLevels, deleteLevel } from '../api/levelApi';
import { getAllLessons, deleteLesson } from '../api/lessonApi';
import { getQuizByLesson, getQuestions, deleteQuestion } from '../api/quizApi';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import '../styles/login.css';

const TYPE_LABELS = {
  mcq: 'اختيار متعدد',
  'true-false': 'صح / خطأ',
  'ai-practice': 'تدريب AI',
};

// ─── Animated confirm strip ───────────────────────────────────────────────────
function ConfirmDelete({ label, onConfirm, onCancel, isLoading }) {
  return (
    <div className="mc-confirm">
      <AlertTriangle size={14} />
      <span>حذف {label}؟ لا يمكن التراجع</span>
      <button className="mc-confirm-yes" onClick={onConfirm} disabled={isLoading}>
        {isLoading ? '...' : 'تأكيد الحذف'}
      </button>
      <button className="mc-confirm-no" onClick={onCancel}>إلغاء</button>
    </div>
  );
}

// ─── Question row ─────────────────────────────────────────────────────────────
function QuestionRow({ question, quizId, canDelete }) {
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const deleteMut = useMutation({
    mutationFn: () => deleteQuestion(quizId, question._id),
    onSuccess: () => {
      toast.success('تم حذف السؤال');
      queryClient.invalidateQueries({ queryKey: ['mc-questions', quizId] });
      setConfirming(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'حدث خطأ');
      setConfirming(false);
    },
  });

  return (
    <div className="mc-question">
      <div className="mc-row mc-row-question">
        <span className="mc-q-dot" />
        <HelpCircle size={13} className="mc-icon-q" />
        <span className="mc-text">{question.questionText}</span>
        <span className={`mc-badge mc-badge-${question.questionType}`}>
          {TYPE_LABELS[question.questionType] || question.questionType}
        </span>
        {!confirming && canDelete && (
          <button className="mc-del-btn" onClick={() => setConfirming(true)} title="حذف السؤال">
            <Trash2 size={13} />
          </button>
        )}
      </div>
      {confirming && (
        <ConfirmDelete
          label="السؤال"
          onConfirm={() => deleteMut.mutate()}
          onCancel={() => setConfirming(false)}
          isLoading={deleteMut.isPending}
        />
      )}
    </div>
  );
}

// ─── Lesson row ───────────────────────────────────────────────────────────────
function LessonRow({ lesson, levelId, canDeleteLesson, canDeleteQuiz }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { data: quizData, isLoading: quizLoading } = useQuery({
    queryKey: ['mc-quiz', lesson._id],
    queryFn: () => getQuizByLesson(lesson._id),
    enabled: expanded,
  });
  const quiz = (quizData?.data?.data?.data || [])[0];

  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['mc-questions', quiz?._id],
    queryFn: () => getQuestions(quiz._id),
    enabled: expanded && !!quiz?._id,
  });
  const questions = questionsData?.data?.data?.data || [];

  const deleteMut = useMutation({
    mutationFn: () => deleteLesson(lesson._id),
    onSuccess: () => {
      toast.success('تم حذف الدرس');
      queryClient.invalidateQueries({ queryKey: ['mc-lessons', levelId] });
      setConfirming(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'حدث خطأ');
      setConfirming(false);
    },
  });

  const isLoadingChildren = expanded && (quizLoading || (quiz && questionsLoading));

  return (
    <div className={`mc-lesson${expanded ? ' mc-lesson-open' : ''}`}>
      <div className="mc-row mc-row-lesson">
        <button className="mc-expand-btn" onClick={() => setExpanded((p) => !p)}>
          <ChevronLeft size={13} className={`mc-chevron${expanded ? ' is-open' : ''}`} />
        </button>
        <div className="mc-lesson-icon">
          <BookOpen size={13} className="mc-icon-l" />
        </div>
        <span className="mc-label">{lesson.title}</span>
        <span className="mc-order-badge">درس {lesson.lessonOrder}</span>
        {!confirming && canDeleteLesson && (
          <button className="mc-del-btn" onClick={() => setConfirming(true)} title="حذف الدرس">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {confirming && (
        <ConfirmDelete
          label="الدرس"
          onConfirm={() => deleteMut.mutate()}
          onCancel={() => setConfirming(false)}
          isLoading={deleteMut.isPending}
        />
      )}

      {expanded && (
        <div className="mc-q-children">
          {isLoadingChildren ? (
            <div className="mc-info-row">جاري التحميل...</div>
          ) : !quiz || questions.length === 0 ? (
            <div className="mc-info-row">
              <HelpCircle size={13} /> لا يوجد اختبار لهذا الدرس
            </div>
          ) : (
            questions.map((q) => (
              <QuestionRow key={q._id} question={q} quizId={quiz._id} canDelete={canDeleteQuiz} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Level row ────────────────────────────────────────────────────────────────
function LevelRow({ level, canDeleteLevel, canDeleteLesson, canDeleteQuiz }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { data: lessonsData, isLoading: lessonsLoading } = useQuery({
    queryKey: ['mc-lessons', level._id],
    queryFn: () => getAllLessons({ levelId: level._id, limit: 100 }),
    enabled: expanded,
  });
  const lessons = [...(lessonsData?.data?.data?.data || [])].sort((a, b) => a.lessonOrder - b.lessonOrder);

  const deleteMut = useMutation({
    mutationFn: () => deleteLevel(level._id),
    onSuccess: () => {
      toast.success('تم حذف المستوى');
      queryClient.invalidateQueries({ queryKey: ['mc-levels'] });
      setConfirming(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'حدث خطأ');
      setConfirming(false);
    },
  });

  return (
    <div className={`mc-level${expanded ? ' mc-level-open' : ''}`}>
      {/* Level header — clicking anywhere expands */}
      <div className="mc-row-level" onClick={() => setExpanded((p) => !p)}>
        <div className="mc-level-icon-wrap">
          {expanded
            ? <FolderOpen size={17} className="mc-icon-lv" />
            : <Layers size={17} className="mc-icon-lv" />}
        </div>
        <span className="mc-label mc-label-level">{level.title}</span>
        <ChevronLeft size={15} className={`mc-chevron mc-chevron-level${expanded ? ' is-open' : ''}`} />
        {!confirming && canDeleteLevel && (
          <button
            className="mc-del-btn mc-del-btn-level"
            onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
            title="حذف المستوى"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {confirming && (
        <ConfirmDelete
          label="المستوى وجميع دروسه"
          onConfirm={() => deleteMut.mutate()}
          onCancel={() => setConfirming(false)}
          isLoading={deleteMut.isPending}
        />
      )}

      {expanded && (
        <div className="mc-children">
          {lessonsLoading ? (
            <div className="mc-info-row">جاري التحميل...</div>
          ) : lessons.length === 0 ? (
            <div className="mc-info-row">
              <BookOpen size={13} /> لا توجد دروس في هذا المستوى
            </div>
          ) : (
            lessons.map((l) => (
              <LessonRow key={l._id} lesson={l} levelId={level._id} canDeleteLesson={canDeleteLesson} canDeleteQuiz={canDeleteQuiz} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ManageContent() {
  const { user } = useAuth();
  const perms = user?.permissions || {};
  const isAdmin = user?.role === 'admin';

  const canDeleteLevel  = isAdmin || perms.canDeleteLevel;
  const canDeleteLesson = isAdmin || perms.canManageLessons;
  const canDeleteQuiz   = isAdmin || perms.canManageQuizzes;

  const { data: levelsData, isLoading } = useQuery({
    queryKey: ['mc-levels'],
    queryFn: getAllLevels,
  });
  const levels = [...(levelsData?.data?.data?.data || [])].sort((a, b) => a.levelOrder - b.levelOrder);

  return (
    <div className="mc-page" dir="rtl">

      {/* Page header */}
      <div className="mc-page-header">
        <div>
          <h2>إدارة المحتوى</h2>
          <p className="mc-subtitle">
            اضغط على المستوى لعرض دروسه &bull; اضغط على الدرس لعرض أسئلته
          </p>
        </div>
        {!isLoading && levels.length > 0 && (
          <div className="mc-header-stat">
            <Layers size={15} />
            <span>{levels.length} مستويات</span>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="mc-skeleton">
          {[1, 2, 3].map((i) => <div key={i} className="mc-skeleton-row" />)}
        </div>
      ) : levels.length === 0 ? (
        <div className="mc-empty-state">
          <FolderOpen size={48} />
          <p>لا توجد مستويات بعد</p>
        </div>
      ) : (
        <div className="mc-tree">
          {levels.map((lv) => (
            <LevelRow
              key={lv._id}
              level={lv}
              canDeleteLevel={canDeleteLevel}
              canDeleteLesson={canDeleteLesson}
              canDeleteQuiz={canDeleteQuiz}
            />
          ))}
        </div>
      )}

    </div>
  );
}
