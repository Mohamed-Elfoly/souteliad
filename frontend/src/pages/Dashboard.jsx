import { X, User, Mail, ArrowUp, Users, UserCheck, BookOpen, FileText } from 'lucide-react';
import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from '../components/ui/Avatar';
import add from "../assets/images/Frame 1984077838.png";
import add2 from "../assets/images/Frame 1984077847.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeacherDashboardStats } from "../api/userApi";
import { createNotification } from "../api/notificationApi";
import { createProgressReport } from "../api/reportApi";
import { getLevels, getAllLessons } from "../api/lessonApi";
import DataTable from "../components/ui/DataTable";
import toast from "react-hot-toast";

const getStudentName = (s) => `${s?.firstName || ''} ${s?.lastName || ''}`.trim();

const progressColumn = {
  key: 'progress',
  label: 'نسبة التقدم',
  render: (row) => (
    <div className="progress-container">
      <span className="progress-text">% {row.progress || 0}</span>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${row.progress || 0}%` }} />
      </div>
      <span className="progress-text">% 100</span>
    </div>
  ),
};

const nameColumn = {
  key: 'name',
  label: 'اسم الطالب',
  render: (row) => (
    <div className="student-info">
      <Avatar
        src={row.profilePicture}
        name={getStudentName(row)}
        iconSize={13}
        className="student-avatar"
      />
      <span className="student-name">{getStudentName(row)}</span>
    </div>
  ),
};

const lessonsColumn = {
  key: 'completedLessons',
  label: 'الدروس المكتملة',
  render: (row) => <span className="progress-text">{row.completedLessons ?? 0}</span>,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notifContent, setNotifContent] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [reportData, setReportData] = useState({
    level: '',
    rating: 5,
    lesson: '',
    notes: '',
  });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: getTeacherDashboardStats,
  });

  const { data: levelsData } = useQuery({
    queryKey: ['levels'],
    queryFn: getLevels,
  });
  const levels = levelsData?.data?.data?.data || [];

  const { data: lessonsData } = useQuery({
    queryKey: ['lessons-by-level', selectedLevelId],
    queryFn: () => getAllLessons({ levelId: selectedLevelId, limit: 100 }),
    enabled: !!selectedLevelId,
  });
  const levelLessons = lessonsData?.data?.data?.data || [];

  const stats = dashboardData?.data?.data;
  const students = (stats?.students || []).map((s) => ({
    ...s,
    name: getStudentName(s),
  }));



  const notifMutation = useMutation({
    mutationFn: (data) => createNotification(data),
    onSuccess: () => {
      toast.success("تم إرسال الإشعار بنجاح");
      setShowForm(false);
      setNotifContent("");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ في إرسال الإشعار");
    },
  });

  const reportMutation = useMutation({
    mutationFn: (data) => createProgressReport(data),
    onSuccess: () => {
      toast.success("تم إنشاء التقرير بنجاح");
      setShowReportForm(false);
      setReportData({ level: '', rating: 5, lesson: '', notes: '' });
      setSelectedLevelId('');
      queryClient.invalidateQueries({ queryKey: ['teacher-dashboard'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ في إنشاء التقرير");
    },
  });

  const handleNotifSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !notifContent.trim()) return;
    notifMutation.mutate({
      userId: selectedStudent._id || selectedStudent.id,
      message: notifContent,
      type: 'announcement',
    });
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    reportMutation.mutate({
      studentId: selectedStudent._id || selectedStudent.id,
      ...reportData,
    });
  };

  const renderActions = (student) => (
    <div className="action-buttons">
      <button className="btn-report" onClick={() => { setSelectedStudent(student); setShowReportForm(true); }}>كتابة تقرير</button>
      <button className="btn-notify" onClick={() => { setSelectedStudent(student); setShowForm(true); }}>ارسال اشعار</button>
    </div>
  );

  return (
    <>
      <div className="action-cards">
              <button className="card" onClick={() => navigate("/AddLessonPage")}>
                <div className="card-icon"><img src={add} alt="" /></div>
                <div className="card-content"><div className="card-title">إضافة درس جديد</div></div>
              </button>
              <button className="card" onClick={() => navigate("/AddQuizPage")}>
                <div className="card-icon"><img src={add2} alt="" /></div>
                <div className="card-content"><div className="card-title">إضافة أسئلة الامتحانات</div></div>
              </button>
      </div>

      {/* Students table */}
      <div className="dashboard-table-wrap">
        <DataTable
          columns={[nameColumn, lessonsColumn, progressColumn]}
          data={students}
          isLoading={isLoading}
          renderActions={renderActions}
        />
      </div>

      {/* Send notification modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box" dir="rtl">
            <div className="modal-header">
              <h2>إرسال إشعار </h2>
              <button className="close-btn" onClick={() => setShowForm(false)}><X size={25} color='red'/></button>
            </div>
            <form className="notification-form" onSubmit={handleNotifSubmit}>
              <div className="form-group">
                <label>الاسم الكامل</label>
                <div className="input-wrapper">
                  <input type="text" value={getStudentName(selectedStudent)} readOnly />
                  <User size={18} />
                </div>
              </div>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <div className="input-wrapper">
                  <input type="email" value={selectedStudent?.email || ""} readOnly />
                  <Mail size={18} />
                </div>
              </div>
              <div className="form-group">
                <label>محتوى الإشعار</label>
                <textarea placeholder="أدخل محتوى الإشعار" value={notifContent} onChange={(e) => setNotifContent(e.target.value)} />
              </div>
              <button type="submit" className="submit-btn btn4" disabled={notifMutation.isPending}>
                {notifMutation.isPending ? "جاري الإرسال..." : "إرسال"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Write report modal */}
      {showReportForm && (
        <div className="modal-overlay">
          <div className="modal-box" dir="rtl">
            <div className="modal-header">
              <h2>كتابة تقرير التعلم </h2>
              <button className="close-btn" onClick={() => setShowReportForm(false)}><X size={25} color='red' /></button>
            </div>
            <form className="notification-form" onSubmit={handleReportSubmit}>
              <div className="form-group">
                <label>الاسم الكامل</label>
                <div className="input-wrapper">
                  <input type="text" value={getStudentName(selectedStudent)} readOnly />
                  <User size={18} />
                </div>
              </div>
              <div className="form-section">
                <label className="form-label">المستوى</label>
                <select
                  name="level"
                  value={selectedLevelId}
                  onChange={(e) => {
                    const chosen = levels.find((l) => (l._id || l.id) === e.target.value);
                    setSelectedLevelId(e.target.value);
                    setReportData(p => ({ ...p, level: chosen?.title || '', lesson: '' }));
                  }}
                  className="form-select"
                >
                  <option value="">اختر المستوى</option>
                  {levels.map((lvl) => (
                    <option key={lvl._id || lvl.id} value={lvl._id || lvl.id}>
                      {lvl.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-section">
                <label className="form-label">الدرس</label>
                <select
                  name="lesson"
                  value={reportData.lesson}
                  onChange={(e) => setReportData(p => ({ ...p, lesson: e.target.value }))}
                  className="form-select"
                  disabled={!selectedLevelId}
                >
                  <option value="">{selectedLevelId ? 'اختر الدرس' : 'اختر المستوى أولاً'}</option>
                  {levelLessons.map((les) => (
                    <option key={les._id || les.id} value={les.title}>
                      {les.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>التقييم</label>
                <div className="rating-container">
                  {[5, 4, 3, 2, 1].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReportData(p => ({ ...p, rating: star }))}
                      className="star-btn"
                      style={{ color: star <= reportData.rating ? 'rgba(255, 193, 7, 1)' : '#ccc' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-section">
                <label className="form-label">الملاحظات:</label>
                <textarea
                  name="notes"
                  placeholder={"أحسنت 👏\nالطالب يتعرّف على الحروف والأرقام بلغة الإشارة بشكل جيد."}
                  value={reportData.notes}
                  onChange={(e) => setReportData(p => ({ ...p, notes: e.target.value }))}
                  className="form-textarea"
                  rows={3}
                />
              </div>
              <div className="form-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowReportForm(false)}>إلغاء</button>
                <button type="submit" className="btn-submit" disabled={reportMutation.isPending}>
                  {reportMutation.isPending ? "جاري الإرسال..." : "إرسال التقرير"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
