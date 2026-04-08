import "../../styles/grades.css";
import { useQuery } from "@tanstack/react-query";
import { getMyAttempts } from "../../api/quizApi";

function ScoreCircle({ percentage }) {
  const pass = percentage >= 60;
  return (
    <div className={`grade-circle ${pass ? "grade-circle--pass" : "grade-circle--fail"}`}>
      <span className="grade-circle-pct">{percentage}</span>
      <span className="grade-circle-sign">%</span>
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="grades-skeleton">
      {[1, 2, 3].map((i) => (
        <div className="grade-skeleton-card" key={i}>
          <div className="skeleton-circle" />
          <div className="skeleton-lines">
            <div className="skeleton-line skeleton-line--long" />
            <div className="skeleton-line skeleton-line--short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Grades() {
  const { data: attemptsData, isLoading } = useQuery({
    queryKey: ["my-attempts"],
    queryFn: getMyAttempts,
  });

  const attempts = (attemptsData?.data?.data?.data || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getPct = (a) => Math.round(((a.score ?? 0) / (a.totalMarks || 1)) * 100);
  const passCount = attempts.filter((a) => getPct(a) >= 60).length;
  const avgPct =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + getPct(a), 0) / attempts.length)
      : 0;

  return (
    <div className="grades-page">
      <div className="profile-section-card">
              {/* Header */}
      <div className="grades-header">
        <h2>درجاتي</h2>
        <p>سجل نتائج اختباراتك ومستوى تقدمك</p>
      </div>

      {/* Summary */}
      {!isLoading && attempts.length > 0 && (
        <div className="grades-summary">
          <div className="grades-summary-item">
            <span className="grades-summary-num">{attempts.length}</span>
            <span className="grades-summary-label">اختبار مكتمل</span>
          </div>
          <div className="grades-summary-item">
            <span className="grades-summary-num">{passCount}</span>
            <span className="grades-summary-label">اجتزت بنجاح</span>
          </div>
          <div className="grades-summary-item">
            <span className="grades-summary-num">{avgPct}%</span>
            <span className="grades-summary-label">متوسط الدرجات</span>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <SkeletonCards />
      ) : attempts.length === 0 ? (
        <div className="grades-state">
          <div className="grades-state-icon">📋</div>
          <h3>لا توجد درجات بعد</h3>
          <p>أكمل اختباراً لترى نتائجك هنا</p>
        </div>
      ) : (
        <div className="grades-list">
          {attempts.map((attempt, index) => {
            const pct = Math.round(((attempt.score ?? 0) / (attempt.totalMarks || 1)) * 100);
            const pass = pct >= 60;
            const title = attempt.quizId?.title || `اختبار ${index + 1}`;
            const subtitle = null;

            return (
              <div className="grade-card" key={attempt._id || index}>
                <ScoreCircle percentage={pct} />

                <div className="grade-card-body">
                  <p className="grade-card-title">{title}</p>
                  {subtitle && <p className="grade-card-subtitle">{subtitle}</p>}

                  <div className="grade-card-stats">
                    <span className="grade-stat">
                      النقاط: {attempt.score ?? "—"} / {attempt.totalMarks ?? "—"}
                    </span>
                    {attempt.createdAt && (
                      <>
                        <span className="grade-stat-dot" />
                        <span className="grade-stat">
                          {new Date(attempt.createdAt).toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <span className={`grade-badge ${pass ? "grade-badge--pass" : "grade-badge--fail"}`}>
                  {pass ? "ناجح" : "راسب"}
                </span>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
