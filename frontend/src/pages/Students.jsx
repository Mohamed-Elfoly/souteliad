import {
  Plus,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import "../styles/login.css";
import group from "../assets/images/Frame 1984077491.png";
import { useQuery } from "@tanstack/react-query";
import { getStudentStats } from "../api/userApi";

export default function Students() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-stats'],
    queryFn: getStudentStats,
  });

  const stats_data = data?.data?.data;

  const stats = stats_data
    ? [
        { label: 'عدد الطلاب الكلي', value: stats_data.totalStudents, up: true },
        { label: 'الطلاب النشطين', value: stats_data.activeStudents, up: true },
        ...(stats_data.levelBreakdown || []).map((lvl) => ({
          label: `طلاب ${lvl.title}`,
          value: lvl.count,
          up: true,
        })),
      ]
    : [];

  if (isLoading) {
    return <div className="admin-state">جاري التحميل...</div>;
  }

  return (
    <>
      <div className='students_card'>
        {stats.map((stat, i) => (
          <div className='student_card' key={i}>
            <div className='student_card_img'>
              <img src={group} alt="groups" />
              <div className={`student_card_down_img ${!stat.up ? 'icon_red' : ''}`}>
                {stat.up ? <ArrowUp size={20} fontWeight={800} /> : <ArrowDown size={20} fontWeight={800} />}
                <Plus size={20} fontWeight={800} />
              </div>
            </div>
            <div className='student_card_left'>
              <p className='student_card_p1'>{stat.label}</p>
              <p className='student_card_p2'>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
