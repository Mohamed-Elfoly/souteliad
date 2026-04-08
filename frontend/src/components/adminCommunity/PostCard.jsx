import { memo } from 'react';
import { Trash2, Eye, MessageSquare } from 'lucide-react';
import Avatar from './shared/Avatar';
import { timeAgo } from './shared/timeAgo';
import { getUserName } from './shared/GetUserName';

const PRIMARY = '#EB6837';

const PostCard = memo(function PostCard({ post, onViewComments, onDelete, isDeleting }) {
  const id       = post._id ?? post.id;
  const name     = getUserName(post);
  const likes    = post.likesCount    ?? post.likes?.length    ?? 0;
  const comments = post.commentsCount ?? post.comments?.length ?? 0;

  return (
    <div className="bg-[#FFF6EA] rounded-2xl border border-[#F9D0C1] p-4 flex flex-col gap-3 hover:shadow-md transition-all hover:-translate-y-0.5 group">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar name={name} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#252C32] text-sm truncate">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{timeAgo(post.createdAt)}</p>
        </div>
        <button
          onClick={() => onDelete(id)}
          disabled={isDeleting}
          className=" group-hover:opacity-100 flex-shrink-0 p-1.5 rounded-lg hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all disabled:cursor-not-allowed cursor-pointer"
          title="حذف المنشور"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
        {post.content ?? post.text ?? '—'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#F9D0C1]/60">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>❤️ {likes}</span>
          <span className="flex items-center gap-1">
            <MessageSquare size={12} /> {comments}
          </span>
        </div>
        <button
          onClick={() => onViewComments(post)}
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70 cursor-pointer"
          style={{ color: PRIMARY }}
        >
          <Eye size={13} />
          عرض التعليقات
        </button>
      </div>
    </div>
  );
});

export default PostCard;