import { useNavigate } from 'react-router-dom';
import DashboardAuthLayout from '../components/layout/DashboardAuthLayout';

export default function DashboardRoleSelect() {
  const navigate = useNavigate();

  return (
    <DashboardAuthLayout>
      <h3 className="dash-role-title">مرحبا بك في لوحة تحكم صوت اليد</h3>
      <p className="dash-role-subtitle">اختار طريقة تسجيل الدخول</p>
      <p className="dash-role-desc">
        اختار دورك عشان نفتح لك لوحة التحكم المناسبة ليك.
      </p>

      <div
        className="dash-role-card"
        onClick={() => navigate('/dashboard-login?role=admin')}
      >
        <h4>تسجيل الدخول للوحة الإدارة</h4>
        <p>رئيس القسم ومنسق المنصة</p>
      </div>

      <div
        className="dash-role-card"
        onClick={() => navigate('/dashboard-login?role=teacher')}
      >
        <h4>تسجيل الدخول للوحة التعليم</h4>
        <p>للدكاترة والمسئولين عن المحتوى والدروس والمتابعة</p>
      </div>
    </DashboardAuthLayout>
  );
}
