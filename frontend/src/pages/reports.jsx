import "../styles/login.css";
import { useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllProgressReports } from "../api/reportApi";
import DataTable from "../components/ui/DataTable";

function Stars({ count }) {
  return (
    <span style={{ color: '#EB6837', fontSize: 16, letterSpacing: 2 }}>
      {'★'.repeat(count || 0)}
      <span style={{ color: '#ddd' }}>{'★'.repeat(5 - (count || 0))}</span>
    </span>
  );
}

function ReportModal({ report, onClose }) {
  if (!report) return null;
  const student = report.studentId || {};
  const teacher = report.teacherId || {};
  const date = report.createdAt ? new Date(report.createdAt).toLocaleDateString('ar-EG') : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" dir="rtl" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h2>تفاصيل التقرير</h2>
          <button className="close-btn" onClick={onClose}><X size={25} color="red"/></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          <div className="report-detail-row">
            <span className="report-detail-label">الطالب</span>
            <span>{student.firstName} {student.lastName}</span>
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">المعلم</span>
            <span>{teacher.firstName} {teacher.lastName}</span>
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">المستوى</span>
            <span>{report.level || '—'}</span>
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">الدرس</span>
            <span>{report.lesson || '—'}</span>
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">التقييم</span>
            <Stars count={report.rating} />
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">التاريخ</span>
            <span>{date}</span>
          </div>
          {report.notes && (
            <div style={{ background: '#FFF7F4', border: '1px solid #F5C6AD', borderRadius: 8, padding: '10px 14px' }}>
              <p className="report-detail-label" style={{ marginBottom: 6 }}>الملاحظات</p>
              <p style={{ margin: 0, lineHeight: 1.7, color: '#444' }}>{report.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['progress-reports'],
    queryFn: () => getAllProgressReports({ limit: 100 }),
  });

  const reports = (reportsData?.data?.data?.data || []).map((r) => ({
    ...r,
    studentName: `${r.studentId?.firstName || ''} ${r.studentId?.lastName || ''}`.trim(),
  }));

  const columns = [
    {
      key: 'studentName',
      label: 'اسم الطالب',
      render: (row) => row.studentName,
    },
    { key: 'level', label: 'المستوى', render: (row) => row.level || '—' },
    { key: 'lesson', label: 'الدرس', render: (row) => row.lesson || '—' },
    { key: 'rating', label: 'التقييم', render: (row) => <Stars count={row.rating} /> },
    {
      key: 'createdAt',
      label: 'التاريخ',
      render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('ar-EG') : '—',
    },
  ];

  return (
    <div className="main-content2">
      <h1 className="page-title">تقارير الطلبة</h1>
      <div className="report_container">
        <DataTable
          columns={columns}
          data={reports}
          isLoading={isLoading}
          searchKeys={['studentName']}
          renderActions={(row) => (
            <button className="btn-orange-small" onClick={() => setSelectedReport(row)}>
              عرض التقرير
            </button>
          )}
        />
      </div>

      <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  );
}
