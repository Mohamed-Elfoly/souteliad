import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ChevronLeft, 
  CheckCheck, 
  Calendar,
  Eye,
  Clock,
  Inbox
} from 'lucide-react';
import { getMyNotifications, markAsRead, markAllAsRead } from '../api/notificationApi';
import { useState } from 'react';

const typeLabels = {
  lesson: 'درس',
  quiz: 'اختبار',
  community: 'مجتمع',
  system: 'نظام',
  announcement: 'إعلان',
};

const typeIcons = {
  lesson: '📘',
  quiz: '📝',
  community: '💬',
  system: '⚙️',
  announcement: '📢',
};

const typeColors = {
  lesson: '#EB6837',
  quiz: '#8B5CF6',
  community: '#10B981',
  system: '#6B7280',
  announcement: '#F59E0B',
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `اليوم، ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `أمس، ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); 
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['notifications-all', page, filter],
    queryFn: () => getMyNotifications({ 
      limit, 
      page,
      ...(filter === 'unread' ? { read: false } : {}),
      ...(filter === 'read' ? { read: true } : {})
    }),
  });

  const notifications = data?.data?.data?.data || [];
  const pagination = data?.data?.data?.pagination || { total: 0, pages: 1 };

  const { mutate: markRead } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-all'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-dropdown'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const { mutate: markAllReadAction } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-all'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-dropdown'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const handleNotificationClick = (notif) => {
    if (!notif.read) markRead(notif._id);
    if (notif.link) navigate(notif.link);
  };

  const groupedNotifications = notifications.reduce((groups, notif) => {
    const date = new Date(notif.createdAt).toLocaleDateString('ar-EG');
    if (!groups[date]) groups[date] = [];
    groups[date].push(notif);
    return groups;
  }, {});

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>رجوع</span>
          </button>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
                {/* <p className="text-gray-500 text-sm mt-1">{pagination.total} إشعار</p> */}
              </div>
            </div>

            {/* {unreadCount > 0 && (
              <button
                onClick={() => markAllReadAction()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <CheckCheck className="w-4 h-4" />
                تعليم الكل كمقروء
              </button>
            )} */}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'الكل', icon: Bell },
            { value: 'unread', label: 'غير مقروءة', icon: Eye },
            { value: 'read', label: 'مقروءة', icon: CheckCheck },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1); }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${filter === f.value 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-24"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">لا توجد إشعارات</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    {formatDate(dateNotifications[0].createdAt)}
                  </span>
                </div>
                <div className="space-y-3">
                  {dateNotifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`
                        group bg-white rounded-2xl p-4 cursor-pointer transition-all duration-200
                        hover:shadow-md hover:scale-[1.01]
                        ${!notif.read ? 'border-r-4 border-orange-500' : 'border border-gray-100'}
                      `}
                    >
                      <div className="flex gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${typeColors[notif.type]}15` }}
                        >
                          <span className="text-2xl">{typeIcons[notif.type] || '🔔'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <span 
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${typeColors[notif.type]}15`, color: typeColors[notif.type] }}
                            >
                              {typeLabels[notif.type] || notif.type}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(notif.createdAt)}
                            </span>
                          </div>
                          <p className={`${!notif.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                            {notif.message}
                          </p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50"
                >
                  السابق
                </button>
                <span className="px-4 py-2 text-gray-600">صفحة {page} من {pagination.pages}</span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}