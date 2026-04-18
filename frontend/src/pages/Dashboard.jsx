import ActionCards        from "../components/teacher/dashboard/ActionCards";
import NotificationModal  from "../components/teacher/dashboard/NotificationModal";
import WriteReportModal   from "../components/teacher/dashboard/WriteReportModal";
import StudentsTable      from "../components/teacher/dashboard/StudentsTable";
import { useDashboard }   from "../hooks/useDashboard";

export default function Dashboard() {
  const {
    students,
    isLoading,
    levels,
    levelLessons,
    selectedStudent,
    showNotifModal,
    setShowNotifModal,
    notifContent,
    setNotifContent,
    notifMutation,
    handleNotifSubmit,
    openNotifModal,
    showReportModal,
    setShowReportModal,
    selectedLevelId,
    reportData,
    setReportData,
    reportMutation,
    handleReportSubmit,
    handleLevelChange,
    openReportModal,
  } = useDashboard();

  return (
    <>
      <ActionCards />

      <div className="mt-6">
        <StudentsTable
          students={students}
          isLoading={isLoading}
          onWriteReport={openReportModal}
          onSendNotif={openNotifModal}
        />
      </div>

      {showNotifModal && (
        <NotificationModal
          student={selectedStudent}
          content={notifContent}
          onContentChange={setNotifContent}
          onSubmit={handleNotifSubmit}
          onClose={() => setShowNotifModal(false)}
          isPending={notifMutation.isPending}
        />
      )}

      {showReportModal && (
        <WriteReportModal
          student={selectedStudent}
          levels={levels}
          levelLessons={levelLessons}
          selectedLevelId={selectedLevelId}
          reportData={reportData}
          onLevelChange={handleLevelChange}
          onReportDataChange={(patch) => setReportData((p) => ({ ...p, ...patch }))}
          onSubmit={handleReportSubmit}
          onClose={() => setShowReportModal(false)}
          isPending={reportMutation.isPending}
        />
      )}
    </>
  );
}