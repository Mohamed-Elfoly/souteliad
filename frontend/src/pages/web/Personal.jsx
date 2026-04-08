import "../../styles/profile.css";
import { useQuery } from "@tanstack/react-query";
import { getAllLevels } from "../../api/levelApi";

const LEVEL_COLORS = ["#EB6837", "#EF865F", "#D65F32", "#81391E"];

export default function Personal() {
  const { data, isLoading } = useQuery({
    queryKey: ["levels"],
    queryFn: getAllLevels,
  });

  const levels = data?.data?.data?.data || [];

  return (
    <div className="profile-section-card">
      <h2 className="profile-section-title">المستويات</h2>
      <p className="profile-section-sub">مستويات تعلم لغة الإشارة المتاحة في المنصة</p>

      {isLoading ? (
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="profile-skeleton-line" />
          ))}
        </div>
      ) : levels.length === 0 ? (
        <div className="profile-empty">
          <p>لا توجد مستويات بعد</p>
        </div>
      ) : (
        <div className="profile-levels">
          {levels.map((level, index) => (
            <div className="profile-level-card" key={level._id}>
              <div
                className="profile-level-num"
                style={{ background: LEVEL_COLORS[index % LEVEL_COLORS.length] }}
              >
                {index + 1}
              </div>
              <span className="profile-level-name">{level.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
