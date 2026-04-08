import { Trash2 } from 'lucide-react';
import "../styles/login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPosts, deletePost } from "../api/postApi";
import toast from "react-hot-toast";

export default function Groups() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts-groups'],
    queryFn: () => getAllPosts({ limit: 20 }),
  });

  const posts = postsData?.data?.data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      toast.success("تم حذف المنشور بنجاح");
      queryClient.invalidateQueries({ queryKey: ['posts-groups'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ في حذف المنشور");
    },
  });

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'منذ أقل من ساعة';
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
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

      <h1 className="page-title">المنشورات</h1>

      {isLoading ? (
        <div className="admin-state">جاري التحميل...</div>
      ) : posts.length === 0 ? (
        <div className="admin-state admin-state--muted">لا توجد منشورات</div>
      ) : (
        <div className='students_card'>
          {posts.map((post) => (
            <div className='student_card group' key={post._id || post.id}>
              <div className='group_card'>
                <div className='group_card_up'>
                  <div className='group_card_text'>
                    <h1>{post.user?.firstName} {post.user?.lastName}</h1>
                    <p>{formatTimeAgo(post.createdAt)}</p>
                  </div>
                  <Trash2
                    color='#D13131'
                    className="clickable"
                    onClick={() => deleteMutation.mutate(post._id || post.id)}
                  />
                </div>
                <div className='group_card_down'>
                  {post.content || post.text || ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
