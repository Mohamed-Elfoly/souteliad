import { X, Trash2, MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Avatar from './shared/Avatar';
import Spinner from './shared/Spinner';
import EmptyState from './shared/EmptyState';
import { timeAgo } from './shared/timeAgo';
import { getUserName } from './shared/GetUserName';
import { getComments, deleteComment } from '../../api/postApi';

export default function CommentsDrawer({ post, onClose }) {
  const queryClient = useQueryClient();
  const postId = post._id ?? post.id;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-comments', postId],
    queryFn:  () => getComments(postId),
    enabled:  !!postId,
  });

  const comments =
    data?.data?.data?.data ??
    data?.data?.data ??
    data?.data ??
    [];

  const delComment = useMutation({
    mutationFn: (id) => deleteComment(id),
    onSuccess: () => {
      toast.success('تم حذف التعليق');
      queryClient.invalidateQueries({ queryKey: ['admin-comments', postId] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'حدث خطأ'),
  });

  const authorName = getUserName(post);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className="fixed top-0 left-0 z-50 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col"
        style={{ animation: 'drawerIn .25s cubic-bezier(.4,0,.2,1)' }}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-[#252C32] text-base">تعليقات المنشور</h3>
            <p className="text-xs text-gray-400 mt-0.5">{authorName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Post preview */}
        <div className="mx-5 mt-4 p-4 rounded-2xl bg-[#FFF6EA] border border-[#F9D0C1] flex-shrink-0">
          <div className="flex items-center gap-2.5 mb-2">
            <Avatar name={authorName} size="sm" />
            <div>
              <p className="text-sm font-semibold text-[#252C32]">{authorName}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {post.content ?? post.text ?? '—'}
          </p>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {isLoading ? (
            <Spinner />
          ) : comments.length === 0 ? (
            <EmptyState message="لا توجد تعليقات على هذا المنشور" icon={MessageSquare} />
          ) : (
            comments.map((c, idx) => {
              const cId   = c._id ?? c.id ?? idx;
              const cName = getUserName(c);
              return (
                <div key={cId} className="flex gap-3 items-start cursor-pointer">
                  <Avatar name={cName} size="sm" />
                  <div className="flex-1 min-w-0 bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-sm font-semibold text-[#252C32] truncate">{cName}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-gray-400">{timeAgo(c.createdAt)}</span>
                        <button
                          onClick={() => delComment.mutate(cId)}
                          disabled={delComment.isPending}
                          className="p-1 rounded-md hover:bg-red-50 hover:text-red-500 text-gray-300 transition-all disabled:cursor-not-allowed cursor-pointer" 
                          title="حذف التعليق"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed break-words">
                      {c.content ?? c.text ?? '—'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0 curser-p">
          <p className="text-xs text-gray-400 text-center">
            صلاحية القراءة والحذف فقط — لا يمكن إضافة تعليقات
          </p>
        </div>
      </aside>

      <style>{`
        @keyframes drawerIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </>
  );
}