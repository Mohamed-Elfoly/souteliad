import "../../styles/profile.css";
import { useQuery } from "@tanstack/react-query";
import { getAllLevels } from "../../api/levelApi";

export default function Personalstandard() {

  const { data, isLoading } = useQuery({
    queryKey: ["levels"],
    queryFn: getAllLevels,
  });

  const levels = data?.data?.data?.data || [];

  if (isLoading) {
    return <p>جاري تحميل المستويات...</p>;
  }

  return (
   <div className="profile-section-card" dir="rtl">
  <div className="profile-container">
    <div className="ps-section-title">
      <h2>حسابي الشخصي</h2>
      <p className="ps-section-sub">المستويات</p>

      <div className="levels-list">
        {levels.map((level, index) => (
          <div key={level._id} className="level-item">
            {/* الدائرة أولاً ثم النص */}
            <span className={`circle circle-${index}`} />
            <span>{level.title}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
  );
}