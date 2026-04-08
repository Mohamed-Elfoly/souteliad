import "../../styles/community.css";
import { X, Heart, MessageCircleMore, Send, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPosts,
  createPost,
  getComments,
  createComment,
  toggleLike,
  deletePost,
  deleteComment,
} from "../../api/postApi";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import successGif from "../../assets/images/send.png";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
function UserAvatar({ user, size = 44, className = "post-user-avatar", onClick }) {
  const letter = (user?.firstName || "م")[0];
  const hasPhoto =
    user?.profilePicture && user.profilePicture !== "default.jpg";

  return (
    <div
      className={className}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      onClick={onClick}
    >
      {hasPhoto ? (
        <img
          src={user.profilePicture}
          alt={letter}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : (
        letter
      )}
    </div>
  );
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "اليوم";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "منذ أقل من ساعة";
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

function PostCard({ post, currentUser, onShowUserInfo, isAdmin, canDeleteAny }) {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const postUser = post.userId || {};
  const isOwnPost = postUser._id?.toString() === currentUser?._id?.toString();
  const showPostDelete = isOwnPost || canDeleteAny;
  const likes = post.likes || [];
  const commentsVirtual = post.comments || [];
  const likeCount = likes.length;
  const commentCount = commentsVirtual.length;

  const isLiked = likes.some((l) => {
    const lid = l.userId?._id || l.userId;
    return lid?.toString() === currentUser?._id?.toString();
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", post._id],
    queryFn: () => getComments(post._id),
    enabled: showComments,
  });

  const comments = commentsData?.data?.data?.data || [];

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(post._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community-posts"] }),
    onError: () => toast.error("حدث خطأ في الإعجاب"),
  });

  const commentMutation = useMutation({
    mutationFn: () => createComment(post._id, { content: commentText }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      setCommentText("");
      toast.success("تم إضافة التعليق");
    },
    onError: () => toast.error("حدث خطأ في إضافة التعليق"),
  });

  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("تم حذف المنشور");
    },
    onError: () => toast.error("حدث خطأ في حذف المنشور"),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("تم حذف التعليق");
    },
    onError: () => toast.error("حدث خطأ في حذف التعليق"),
  });

  return (
    <div className="post-card">
      <div className="post-card-body">
        {/* Header */}
        <div className="post-card-header">
          <UserAvatar
            user={postUser}
            size={44}
            className="post-user-avatar"
            onClick={() => onShowUserInfo(postUser)}
          />
          <div className="post-user-meta">
            <p className="post-user-name">
              {postUser.firstName || ""} {postUser.lastName || ""}
            </p>
            <span className="post-date">{formatTimeAgo(post.createdAt)}</span>
          </div>
          {showPostDelete && (
            <button
              className="post-delete-btn"
              onClick={() => deletePostMutation.mutate()}
              disabled={deletePostMutation.isPending}
              title="حذف المنشور"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="post-content">{post.content}</p>

        {/* Actions */}
        <div className="post-actions">
          <button
            className={`post-action-btn ${isLiked ? "post-action-btn--liked" : ""}`}
            onClick={() => !likeMutation.isPending && likeMutation.mutate()}
          >
            <Heart
              size={18}
              fill={isLiked ? "currentColor" : "none"}
            />
            <span>{likeCount > 0 ? likeCount : ""} أعجبني</span>
          </button>

          <button
            className="post-action-btn"
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageCircleMore size={18} />
            <span>{commentCount > 0 ? commentCount : ""} تعليق</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="comments-section">
          {commentsLoading ? (
            <p className="comments-loading">جاري تحميل التعليقات...</p>
          ) : comments.length === 0 ? (
            <p className="comments-empty">لا توجد تعليقات بعد</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="comment-item">
                <UserAvatar
                  user={c.userId}
                  size={32}
                  className="comment-avatar"
                  onClick={() => onShowUserInfo(c.userId)}
                />
                <div className="comment-bubble">
                  <p className="comment-bubble-name">
                    {c.userId?.firstName} {c.userId?.lastName}
                  </p>
                  <p className="comment-bubble-text">{c.content}</p>
                  <span className="comment-bubble-time">
                    {formatTimeAgo(c.createdAt)}
                  </span>
                </div>
                {(canDeleteAny || c.userId?._id?.toString() === currentUser?._id?.toString()) && (
                  <button
                    className="comment-delete-btn"
                    onClick={() => deleteCommentMutation.mutate(c._id)}
                    disabled={deleteCommentMutation.isPending}
                    title="حذف التعليق"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))
          )}

          {/* Add comment input */}
          <div className="comment-input-row">
            <UserAvatar user={currentUser} size={32} className="comment-avatar" />
            <input
              className="comment-input"
              placeholder="اكتب تعليقك..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentText.trim() && !commentMutation.isPending) {
                  commentMutation.mutate();
                }
              }}
            />
            <button
              className="comment-send-btn"
              disabled={!commentText.trim() || commentMutation.isPending}
              onClick={() => commentMutation.mutate()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Community() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userInfoModal, setUserInfoModal] = useState(null);

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["community-posts"],
    queryFn: () => getAllPosts({ sort: "-createdAt", limit: 20 }),
  });

  const posts = postsData?.data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => createPost(data),
    onSuccess: () => {
Swal.fire({
 title: "شكرًا لمشاركتك",
  text: "تم نشر مساهمتك بنجاح، ونقدّر تفاعلك مع المجتمع.",
    imageUrl: successGif,                
    imageWidth: 200,
    imageHeight: 170,
    imageAlt: "نجاح",
    confirmButtonText: "تمام",
    confirmButtonColor: "#EB6837",
    timerProgressBar: true,
    showConfirmButton: false,            
    allowOutsideClick: true,            
    customClass: {
      popup: 'success-popup',            
    }
    });

  queryClient.invalidateQueries({ queryKey: ["community-posts"] });
  setTitle("");
  setContent("");
  setShowModal(false);
},
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ في نشر المنشور");
    },
  });

  const handleShowUserInfo = (postUser) => {
    if (!postUser?.firstName) return;
    setUserInfoModal(postUser);
  };

  return (
    <>
      <div className="community-page">
        <div className="community-inner">

          {/* Page Header */}
          <div className="community-header">
            <div className="community-header-left">
              <h1>مجتمع صوت اليد</h1>
              <p>شارك تجاربك وتفاعل مع المتعلمين</p>
            </div>
            <button
              className="community-new-btn"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} />
              إضافة منشور
            </button>
          </div>

          {/* Feed */}
          <div className="community-feed">
            {isLoading ? (
              <div className="community-state">
                <div className="community-spinner" />
                <p>جاري التحميل...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="community-state">
                <div className="community-state-icon">💬</div>
                <p>لا توجد منشورات بعد — كن أول من يشارك!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user}
                  onShowUserInfo={handleShowUserInfo}
                  isAdmin={user?.role === ROLES.ADMIN || user?.permissions?.canDeleteContent === true}
                  canDeleteAny={user?.role === ROLES.ADMIN || user?.permissions?.canDeleteContent === true}
                />
              ))
            )}
          </div>

        </div>
      </div>

      {/* New Post Modal */}
      {showModal && (
        <div className="community-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="community-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="community-modal-close"
              onClick={() => setShowModal(false)}
            >
              <X size={20} color="red" />
            </button>

            <h2 className="community-modal-title">منشور جديد</h2>
            <p className="community-modal-sub">
              شارك تجربتك أو سؤالك مع مجتمع صوت اليد
            </p>

            <label>عنوان المنشور</label>
            <input
              className="community-modal-input"
              placeholder="اكتب عنواناً قصيراً وواضحاً"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>نص المنشور</label>
            <textarea
              className="community-modal-textarea"
              placeholder="اكتب رأيك، تجربتك، أو سؤالك هنا..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              className="community-publish-btn"
              onClick={() => {
                if (content.trim()) createMutation.mutate({ title, content });
              }}
              disabled={!content.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? "جاري النشر..." : "نشر المنشور"}
            </button>
          </div>
        </div>
      )}

      {/* User Info Modal */}
      {userInfoModal && (
        <div
          className="community-modal-overlay"
          onClick={() => setUserInfoModal(null)}
        >
          <div
            className="user-info-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="community-modal-close"
              onClick={() => setUserInfoModal(null)}
            >
              <X size={20} color="#868687" />
            </button>

            <div className="user-info-modal-avatar">
              <UserAvatar user={userInfoModal} size={72} className="post-user-avatar" />
            </div>
            <h3>
              {userInfoModal.firstName} {userInfoModal.lastName}
            </h3>
            <p>{userInfoModal.email}</p>
          </div>
        </div>
      )}
    </>
  );
}
