import { useState, useCallback } from 'react';
import { LayoutList } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PostCard from './PostCard';
import CommentsDrawer from './CommentsDrawer';
import Spinner from './shared/Spinner';
import EmptyState from './shared/EmptyState';
import { getAllPosts, deletePost } from '../../api/postApi';

export default function PostsTab() {
  const [activePost, setActivePost] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn:  () => getAllPosts({ limit: 50 }),
  });

  const posts = data?.data?.data?.data ?? data?.data?.data ?? [];

  const delPost = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      toast.success('تم حذف المنشور بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'حدث خطأ في الحذف'),
  });

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
        delPost.mutate(id);
      }
    },
    [delPost]
  );

  if (isLoading) {
    return <div className="p-6"><Spinner /></div>;
  }

  if (posts.length === 0) {
    return <div className="p-6"><EmptyState message="لا توجد منشورات" icon={LayoutList} /></div>;
  }

  return (
    <>
      <div className="p-4 md:p-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post._id ?? post.id}
            post={post}
            onViewComments={setActivePost}
            onDelete={handleDelete}
            isDeleting={delPost.isPending}
          />
        ))}
      </div>

      {activePost && (
        <CommentsDrawer
          post={activePost}
          onClose={() => setActivePost(null)}
        />
      )}
    </>
  );
}