import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getTeacherDashboardStats } from "../api/userApi";
import { createNotification } from "../api/notificationApi";
import { createProgressReport } from "../api/reportApi";
import { getLevels, getAllLessons } from "../api/lessonApi";

export const getStudentName = (s) =>
  `${s?.firstName || ""} ${s?.lastName || ""}`.trim();

const EMPTY_REPORT = { level: "", rating: 5, lesson: "", notes: "" };

export function useDashboard() {
  const queryClient = useQueryClient();

  // ── Modal visibility ──────────────────────────────────────────────────────
  const [showNotifModal,  setShowNotifModal]  = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ── Notification form state ───────────────────────────────────────────────
  const [notifContent, setNotifContent] = useState("");

  // ── Report form state ─────────────────────────────────────────────────────
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [reportData, setReportData] = useState(EMPTY_REPORT);

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: getTeacherDashboardStats,
  });

  const { data: levelsData } = useQuery({
    queryKey: ["levels"],
    queryFn: getLevels,
  });
  const levels = levelsData?.data?.data?.data || [];

  const { data: lessonsData } = useQuery({
    queryKey: ["lessons-by-level", selectedLevelId],
    queryFn: () => getAllLessons({ levelId: selectedLevelId, limit: 100 }),
    enabled: !!selectedLevelId,
  });
  const levelLessons = lessonsData?.data?.data?.data || [];

  // ── Derived data ──────────────────────────────────────────────────────────
  const stats = dashboardData?.data?.data;
  const students = (stats?.students || []).map((s) => ({
    ...s,
    name: getStudentName(s),
  }));

  // ── Mutations ─────────────────────────────────────────────────────────────
  const notifMutation = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      toast.success("تم إرسال الإشعار بنجاح");
      setShowNotifModal(false);
      setNotifContent("");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ في إرسال الإشعار");
    },
  });

  const reportMutation = useMutation({
    mutationFn: createProgressReport,
    onSuccess: () => {
      toast.success("تم إنشاء التقرير بنجاح");
      setShowReportModal(false);
      setReportData(EMPTY_REPORT);
      setSelectedLevelId("");
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ في إنشاء التقرير");
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openNotifModal = (student) => {
    setSelectedStudent(student);
    setShowNotifModal(true);
  };

  const openReportModal = (student) => {
    setSelectedStudent(student);
    setShowReportModal(true);
  };

  const handleNotifSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !notifContent.trim()) return;
    notifMutation.mutate({
      userId: selectedStudent._id || selectedStudent.id,
      message: notifContent,
      type: "announcement",
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

  const handleLevelChange = (e) => {
    const chosen = levels.find((l) => (l._id || l.id) === e.target.value);
    setSelectedLevelId(e.target.value);
    setReportData((p) => ({ ...p, level: chosen?.title || "", lesson: "" }));
  };

  return {
    // data
    students,
    isLoading,
    levels,
    levelLessons,
    selectedStudent,
    // notification modal
    showNotifModal,
    setShowNotifModal,
    notifContent,
    setNotifContent,
    notifMutation,
    handleNotifSubmit,
    openNotifModal,
    // report modal
    showReportModal,
    setShowReportModal,
    selectedLevelId,
    reportData,
    setReportData,
    reportMutation,
    handleReportSubmit,
    handleLevelChange,
    openReportModal,
  };
}