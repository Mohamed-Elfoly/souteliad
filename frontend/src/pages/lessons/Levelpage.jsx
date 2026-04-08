import "../../styles/levelPage.css";
import { X, ChevronLeft, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLevel, getLevelLessons, getAllLevels } from "../../api/levelApi";
import { getMyProgress } from "../../api/lessonApi";
import useAuth from "../../hooks/useAuth";
import one from "../../assets/images/one.png";
import two from "../../assets/images/two.png";
import three from "../../assets/images/three.png";
import four from "../../assets/images/four.png";

const LEVEL_IMAGES = [one, two, three, four];

export default function LevelPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: levelData } = useQuery({
    queryKey: ['level', levelId],
    queryFn: () => getLevel(levelId),
    enabled: !!levelId,
  });

  const { data: lessonsData, isLoading } = useQuery({
    queryKey: ['level-lessons', levelId],
    queryFn: () => getLevelLessons(levelId),
    enabled: !!levelId,
  });

  const { data: levelsData } = useQuery({
    queryKey: ['levels'],
    queryFn: getAllLevels,
  });

  const { data: progressData } = useQuery({
    queryKey: ['my-progress'],
    queryFn: getMyProgress,
    enabled: !!user,
  });

  const level   = levelData?.data?.data?.data;
  const lessons = (lessonsData?.data?.data?.data || []).sort((a, b) => a.lessonOrder - b.lessonOrder);
  const levels  = (levelsData?.data?.data?.data || []).sort((a, b) => a.levelOrder - b.levelOrder);

  const progressItems = progressData?.data?.data?.data || [];
  const completedIds  = new Set(progressItems.map((p) => p.lessonId?._id || p.lessonId));

  return (
    <>
      <div className="one_div">
        <p className="lesson_one">الدرس</p>
        <ChevronLeft size={20} color="#EB6837" />
        <p>{level?.title || '...'}</p>
      </div>

      <div className="level-wrapper">
        <div className="level-header">
          <div className="header-right">
            <h2>{level?.title || ''}</h2>
            <p>{level?.description || ''}</p>
          </div>
          <X className="close" onClick={() => navigate('/Lessons')} />
        </div>

        {levels.length > 0 && (
          <div className="levels">
            {levels.map((lvl, index) => (
              <button
                key={lvl._id}
                className={`lvl${lvl._id === levelId ? ' active' : ''}`}
                onClick={() => navigate(`/Levelpage/${lvl._id}`)}
              >
                <img src={LEVEL_IMAGES[index % LEVEL_IMAGES.length]} alt="" />
                <p>{lvl.title}</p>
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="level-state">جاري التحميل...</div>
        ) : (
          <>
            <h3 className="lesson_head">الدروس</h3>
            {lessons.map((lesson) => {
              const isCompleted = completedIds.has(lesson._id);
              return (
                <div
                  key={lesson._id}
                  className={`lesson-item${isCompleted ? ' lesson-item--done' : ''}`}
                  onClick={() => navigate(`/Levelone/${lesson._id}`)}
                >
                  {isCompleted ? (
                    <CheckCircle size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                  ) : (
                    <input type="checkbox" readOnly />
                  )}
                  <div>
                    <h4>{lesson.title}</h4>
                    <p>{lesson.description || 'شرح مبسط مع أمثلة تفاعلية.'}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
