import { ArrowUp, Users, UserCheck, BookOpen, FileText } from 'lucide-react';
import "../styles/login.css";
import { useQuery} from "@tanstack/react-query";
import { getTeacherDashboardStats } from "../api/userApi";
    

export default function StudentsTeacher() {


      const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: getTeacherDashboardStats,
  });
        const stats = dashboardData?.data?.data;

const statCards = stats
    ? [
        { label: 'إجمالي الطلاب', value: stats.totalStudents, icon: Users },
        { label: 'الطلاب النشطين', value: stats.activeStudents, icon: UserCheck },
        { label: 'إجمالي الدروس', value: stats.totalLessons, icon: BookOpen },
        { label: 'التقارير المكتوبة', value: stats.totalReports, icon: FileText },
      ]
    : [];




  return (
    <>
        
    {/* Stats bar */}
      <div className="students_card">
        {isLoading
          ? null
          : statCards.map((card, i) => (
              <div className="student_card" key={i}>
                <div className="student_card_img">
                  <card.icon size={26} color="#EB6837" strokeWidth={1.8} />
                  <div className="student_card_down_img">
                    <ArrowUp size={20} fontWeight={800} />
                  </div>
                </div>
                <div className="student_card_left">
                  <p className="student_card_p1">{card.label}</p>
                  <p className="student_card_p2">{card.value ?? '—'}</p>
                </div>
              </div>
            ))}
      </div>

    </>
  );
}

