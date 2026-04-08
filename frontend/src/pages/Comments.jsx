import {
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import "../styles/login.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPosts, deleteComment } from "../api/postApi";
import toast from "react-hot-toast";

export default function Comments() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts-comments', currentPage],
    queryFn: () => getAllPosts({ page: currentPage, limit: 8 }),
  });

  const evaluations = postsData?.data?.data?.data || [];
  const totalResults = postsData?.data?.results || 0;

  const deleteMutation = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      toast.success("تم حذف التعليق بنجاح");
      queryClient.invalidateQueries({ queryKey: ['posts-comments'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ في حذف التعليق");
    },
  });

  const getStatusText = (status) => {
    switch (status) {
      case "reviewed": return "مرئي";
      case "notvisible": return "غير مرئي";
      default: return status || "مرئي";
    }
  };

  return (
    <>
      <div className="tabs-container">
        <button className={`tab ${location.pathname === '/Comments' ? 'active' : ''}`} onClick={() => navigate('/Comments')}>
          التعليقات
        </button>
        <button className={`tab ${location.pathname === '/Groups' ? 'active' : ''}`} onClick={() => navigate('/Groups')}>
          المنشورات
        </button>
      </div>

      <h1 className="page-title">التعليقات</h1>

      <div className="admin-table-wrap">
        {isLoading ? (
          <div className="admin-state">جاري التحميل...</div>
        ) : evaluations.length === 0 ? (
          <div className="admin-state admin-state--muted">لا توجد تعليقات</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>الإسم</th>
                <th>التعليق</th>
                <th>أضيف علي منشور</th>
                <th>الحالة</th>
                <th>حذف التعليق</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation, index) => (
                <tr key={evaluation._id || evaluation.id || index}>
                  <td className="td-center">
                    <div className='num'>
                      <input type="checkbox" className="checkbox" />
                      <span>{(currentPage - 1) * 8 + index + 1}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <img
                        src={`https://ui-avatars.com/api/?name=${evaluation.user?.firstName || 'U'}&background=f97316&color=fff&size=40`}
                        alt={evaluation.user?.firstName}
                        className="user-avatar"
                      />
                      <span>{evaluation.user?.firstName} {evaluation.user?.lastName}</span>
                    </div>
                  </td>
                  <td>{evaluation.content || evaluation.text || ''}</td>
                  <td>{evaluation.post?.user?.firstName || ''}</td>
                  <td>
                    <span className={`status-badge ${evaluation.visible !== false ? 'reviewed' : 'notvisible'}`}>
                      {getStatusText(evaluation.visible !== false ? 'reviewed' : 'notvisible')}
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteMutation.mutate(evaluation._id || evaluation.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <X size={20} color="#D13131" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <div className="side">
            <button className="pagination-button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><ChevronRight /></button>
            <button className={`pagination-button ${currentPage === 1 ? "active" : ""}`} onClick={() => setCurrentPage(1)}>١</button>
            <button className="pagination-button" onClick={() => setCurrentPage(2)}>٢</button>
            <button className="pagination-button" onClick={() => setCurrentPage(p => p + 1)}><ChevronLeft /></button>
          </div>
          <span className="pagination-info">أظهار {evaluations.length} من {totalResults || '٠'}</span>
        </div>
      </div>
    </>
  );
}
