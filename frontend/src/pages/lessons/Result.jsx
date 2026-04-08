import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markLessonComplete } from "../../api/lessonApi";
import "../../styles/result.css";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { score = 0, totalMarks = 0, passed = false, lessonId, levelId } = location.state || {};
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const statusClass = passed ? "pass" : "fail";

  const { mutate: complete } = useMutation({
    mutationFn: markLessonComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-progress"] });
    },
  });

  useEffect(() => {
    if (passed && lessonId) {
      complete(lessonId);
    }
  }, [passed, lessonId, complete]);

  return (
    <div className="result-page" dir="rtl">
      {/* Close button */}
      <button className="result-close-btn" onClick={() => navigate("/Lessons", { state: { levelId } })}>
        <X size={25} />
      </button>

      {/* Card */}
      <div className="result-card">
        {/* Icon */}
        <div className="result-icon-wrap">
          {passed ? (
            <CheckCircle size={72} color="#22c55e" strokeWidth={1.5} />
          ) : (
            <XCircle size={72} color="#ef4444" strokeWidth={1.5} />
          )}
        </div>

        <h1 className={`result-status result-status--${statusClass}`}>
          {passed ? "أحسنت! لقد نجحت 🎉" : "لم تنجح هذه المرة"}
        </h1>

        <p className="result-subtitle">
          {passed
            ? "لقد أكملت الاختبار بنجاح وأضفت هذا الدرس لإنجازاتك"
            : "لا بأس، راجع الدرس وحاول مرة أخرى"}
        </p>

        {/* Score circle */}
        <div className={`result-score-circle result-score-circle--${statusClass}`}>
          <span className={`result-score-percent result-score-percent--${statusClass}`}>
            {percentage}%
          </span>
          <span className="result-score-fraction">
            {score} / {totalMarks} درجات
          </span>
        </div>

        {/* Info row */}
        <div className="result-info-row">
          <div className="result-info-item">
            <span className="result-info-label">درجة النجاح</span>
            <span className="result-info-value">60%</span>
          </div>
          <div className="result-info-divider" />
          <div className="result-info-item">
            <span className="result-info-label">درجتك</span>
            <span className={`result-info-value result-info-value--${statusClass}`}>
              {percentage}%
            </span>
          </div>
          <div className="result-info-divider" />
          <div className="result-info-item">
            <span className="result-info-label">النتيجة</span>
            <span className={`result-info-value result-info-value--${statusClass}`}>
              {passed ? "ناجح ✓" : "غير ناجح ✗"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="result-actions">
          {passed ? (
            <button className="btn-primary" onClick={() => navigate("/Lessons", { state: { levelId } })}>
              العودة للدروس
            </button>
          ) : (
            <>
              <button className="btn-primary" onClick={() => navigate(-3)}>
                حاول مرة تانية
              </button>
              <button className="btn-outline" onClick={() => navigate("/Lessons", { state: { levelId } })}>
                العودة للدروس
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
