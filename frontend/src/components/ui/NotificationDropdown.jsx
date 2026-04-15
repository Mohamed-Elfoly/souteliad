// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Link, useNavigate } from 'react-router-dom';
// import { getMyNotifications, markAsRead } from '../../api/notificationApi';

// const typeLabels = {
//   lesson:       'درس',
//   quiz:         'اختبار',
//   community:    'مجتمع',
//   system:       'نظام',
//   announcement: 'إعلان',
// };

// const typeColors = {
//   lesson:       '#EB6837',
//   quiz:         '#8B5CF6',
//   community:    '#10B981',
//   system:       '#6B7280',
//   announcement: '#F59E0B',
// };

// function timeAgo(dateStr) {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return 'الآن';
//   if (mins < 60) return `منذ ${mins} دقيقة`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `منذ ${hrs} ساعة`;
//   const days = Math.floor(hrs / 24);
//   return `منذ ${days} يوم`;
// }

// export default function NotificationDropdown({ isOpen, onClose }) {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ['notifications-dropdown'],
//     queryFn: () => getMyNotifications({ limit: 6 }),
//     enabled: isOpen,
//     staleTime: 30_000,
//   });

//   const notifications = data?.data?.data?.data || [];

//   const { mutate: markRead } = useMutation({
//     mutationFn: markAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notifications-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['unread-count'] });
//     },
//   });

//   const handleClick = (notif) => {
//     if (!notif.read) markRead(notif._id);
//     onClose();
//     if (notif.link) navigate(notif.link);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="notif-dropdown" dir="rtl">
//       <div className="notif-header">
//         <span className="notif-title">الإشعارات</span>
//       </div>

//       {isLoading ? (
//         <div className="notif-state">جاري التحميل...</div>
//       ) : notifications.length === 0 ? (
//         <div className="notif-state">لا توجد إشعارات</div>
//       ) : (
//         <ul className="notif-list">
//           {notifications.map((n) => (
//             <li
//               key={n._id}
//               className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
//               onClick={() => handleClick(n)}
//             >
//               <span
//                 className="notif-type-badge"
//                 style={{ background: typeColors[n.type] || '#6B7280' }}
//               >
//                 {typeLabels[n.type] || n.type}
//               </span>
//               <div className="notif-body">
//                 <p className="notif-message">{n.message}</p>
//                 <span className="notif-time">{timeAgo(n.createdAt)}</span>
//               </div>
//               {!n.read && <span className="notif-unread-dot" />}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


// NotificationDropdown.jsx
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Link, useNavigate } from 'react-router-dom';
// import { Bell, ChevronLeft, Calendar, Eye } from 'lucide-react';
// import { getMyNotifications, markAsRead } from '../../api/notificationApi';

// const typeLabels = {
//   lesson: 'درس',
//   quiz: 'اختبار',
//   community: 'مجتمع',
//   system: 'نظام',
//   announcement: 'إعلان',
// };

// const typeIcons = {
//   lesson: '📘',
//   quiz: '📝',
//   community: '💬',
//   system: '⚙️',
//   announcement: '📢',
// };

// const typeColors = {
//   lesson: '#EB6837',
//   quiz: '#8B5CF6',
//   community: '#10B981',
//   system: '#6B7280',
//   announcement: '#F59E0B',
// };

// function timeAgo(dateStr) {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return 'الآن';
//   if (mins < 60) return `منذ ${mins} دقيقة`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `منذ ${hrs} ساعة`;
//   const days = Math.floor(hrs / 24);
//   if (days < 7) return `منذ ${days} يوم`;
//   const weeks = Math.floor(days / 7);
//   return `منذ ${weeks} أسبوع`;
// }

// function formatDate(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString('ar-EG', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });
// }

// export default function NotificationDropdown({ isOpen, onClose }) {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ['notifications-dropdown'],
//     queryFn: () => getMyNotifications({ limit: 5 }),
//     enabled: isOpen,
//     staleTime: 30_000,
//   });

//   const notifications = data?.data?.data?.data || [];

//   const { mutate: markRead } = useMutation({
//     mutationFn: markAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notifications-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['unread-count'] });
//     },
//   });

//   const handleClick = (notif) => {
//     if (!notif.read) markRead(notif._id);
//     onClose();
//     if (notif.link) navigate(notif.link);
//   };

//   const handleViewAll = () => {
//     onClose();
//     navigate('/notifications');
//   };

//   if (!isOpen) return null;

//   // Group notifications by date
//   const today = [];
//   const yesterday = [];
//   const older = [];

//   const todayStart = new Date();
//   todayStart.setHours(0, 0, 0, 0);
  
//   const yesterdayStart = new Date(todayStart);
//   yesterdayStart.setDate(yesterdayStart.getDate() - 1);

//   notifications.forEach((notif) => {
//     const notifDate = new Date(notif.createdAt);
//     if (notifDate >= todayStart) {
//       today.push(notif);
//     } else if (notifDate >= yesterdayStart) {
//       yesterday.push(notif);
//     } else {
//       older.push(notif);
//     }
//   });

//   const renderNotificationItem = (n) => (
//     <div
//       key={n._id}
//       onClick={() => handleClick(n)}
//       className={`
//         group flex items-start gap-3 p-3 rounded-xl cursor-pointer
//         transition-all duration-200
//         hover:bg-gray-50
//         ${!n.read ? 'bg-orange-50/30' : ''}
//       `}
//     >
//       {/* Icon / Avatar */}
//       <div 
//         className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
//         style={{ backgroundColor: `${typeColors[n.type]}15` }}
//       >
//         <span className="text-xl">{typeIcons[n.type] || '🔔'}</span>
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <span 
//             className="text-xs font-medium px-2 py-0.5 rounded-full"
//             style={{ backgroundColor: `${typeColors[n.type]}15`, color: typeColors[n.type] }}
//           >
//             {typeLabels[n.type] || n.type}
//           </span>
//           {!n.read && (
//             <span className="w-2 h-2 rounded-full bg-orange-500"></span>
//           )}
//         </div>
//         <p className={`text-sm ${!n.read ? 'text-gray-900 font-medium' : 'text-gray-600'} line-clamp-2`}>
//           {n.message}
//         </p>
//         <p className="text-xs text-gray-400 mt-1">
//           {timeAgo(n.createdAt)}
//         </p>
//       </div>

//       {/* Arrow indicator */}
//       <ChevronLeft className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
//     </div>
//   );

//   return (
//     <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
//       {/* Header */}
//       <div className="px-4 py-3 border-b border-gray-100 bg-white sticky top-0">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Bell className="w-5 h-5 text-gray-600" />
//             <h3 className="font-semibold text-gray-900">الإشعارات</h3>
//           </div>
//           {notifications.length > 0 && (
//             <button
//               onClick={handleViewAll}
//               className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
//             >
//               عرض الكل
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-h-[480px] overflow-y-auto">
//         {isLoading ? (
//           <div className="p-8 text-center">
//             <div className="animate-pulse flex flex-col items-center gap-3">
//               <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
//               <div className="h-4 w-32 bg-gray-100 rounded"></div>
//             </div>
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="p-8 text-center">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <Bell className="w-8 h-8 text-gray-300" />
//             </div>
//             <p className="text-gray-500">لا توجد إشعارات جديدة</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-50">
//             {today.length > 0 && (
//               <div>
//                 <div className="px-4 py-2 bg-gray-50/50">
//                   <span className="text-xs font-medium text-gray-500">اليوم</span>
//                 </div>
//                 {today.map(renderNotificationItem)}
//               </div>
//             )}
//             {yesterday.length > 0 && (
//               <div>
//                 <div className="px-4 py-2 bg-gray-50/50">
//                   <span className="text-xs font-medium text-gray-500">أمس</span>
//                 </div>
//                 {yesterday.map(renderNotificationItem)}
//               </div>
//             )}
//             {older.length > 0 && (
//               <div>
//                 <div className="px-4 py-2 bg-gray-50/50">
//                   <span className="text-xs font-medium text-gray-500">سابقاً</span>
//                 </div>
//                 {older.map(renderNotificationItem)}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Footer with View All button when there are notifications */}
//       {!isLoading && notifications.length > 0 && (
//         <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
//           <button
//             onClick={handleViewAll}
//             className="w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium py-1 transition-colors cursor-pointer"
//           >
//             عرض جميع الإشعارات
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }















// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { Bell, ChevronLeft } from 'lucide-react';
// import { getMyNotifications, markAsRead } from '../../api/notificationApi';

// const typeLabels = {
//   lesson: 'درس',
//   quiz: 'اختبار',
//   community: 'مجتمع',
//   system: 'نظام',
//   announcement: 'إعلان',
// };

// const typeIcons = {
//   lesson: '📘',
//   quiz: '📝',
//   community: '💬',
//   system: '⚙️',
//   announcement: '📢',
// };

// const typeColors = {
//   lesson: '#EB6837',
//   quiz: '#8B5CF6',
//   community: '#10B981',
//   system: '#6B7280',
//   announcement: '#F59E0B',
// };

// function timeAgo(dateStr) {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return 'الآن';
//   if (mins < 60) return `منذ ${mins} دقيقة`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `منذ ${hrs} ساعة`;
//   const days = Math.floor(hrs / 24);
//   if (days < 7) return `منذ ${days} يوم`;
//   const weeks = Math.floor(days / 7);
//   return `منذ ${weeks} أسبوع`;
// }

// export default function NotificationDropdown({ isOpen, onClose }) {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ['notifications-dropdown'],
//     queryFn: () => getMyNotifications({ limit: 5 }),
//     enabled: isOpen,
//     staleTime: 30_000,
//   });

//   const notifications = data?.data?.data?.data || [];

//   const { mutate: markRead } = useMutation({
//     mutationFn: markAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notifications-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['unread-count'] });
//     },
//   });

//   const handleClick = (notif) => {
//     if (!notif.read) markRead(notif._id);
//     onClose();
//     if (notif.link) navigate(notif.link);
//   };

//   const handleViewAll = () => {
//     onClose();
//     navigate('/notifications');
//   };

//   if (!isOpen) return null;

//   // Group notifications by date
//   const today = [];
//   const yesterday = [];
//   const older = [];

//   const todayStart = new Date();
//   todayStart.setHours(0, 0, 0, 0);
  
//   const yesterdayStart = new Date(todayStart);
//   yesterdayStart.setDate(yesterdayStart.getDate() - 1);

//   notifications.forEach((notif) => {
//     const notifDate = new Date(notif.createdAt);
//     if (notifDate >= todayStart) {
//       today.push(notif);
//     } else if (notifDate >= yesterdayStart) {
//       yesterday.push(notif);
//     } else {
//       older.push(notif);
//     }
//   });

//   const renderNotificationItem = (n) => (
//     <div
//       key={n._id}
//       onClick={() => handleClick(n)}
//       className={`
//         group flex items-start gap-3 p-3 rounded-xl cursor-pointer
//         transition-all duration-200
//         hover:bg-gray-50
//         ${!n.read ? 'bg-orange-50/30' : ''}
//       `}
//     >
//       <div 
//         className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
//         style={{ backgroundColor: `${typeColors[n.type]}15` }}
//       >
//         <span className="text-xl">{typeIcons[n.type] || '🔔'}</span>
//       </div>

//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <span 
//             className="text-xs font-medium px-2 py-0.5 rounded-full"
//             style={{ backgroundColor: `${typeColors[n.type]}15`, color: typeColors[n.type] }}
//           >
//             {typeLabels[n.type] || n.type}
//           </span>
//           {!n.read && (
//             <span className="w-2 h-2 rounded-full bg-orange-500"></span>
//           )}
//         </div>
//         <p className={`text-sm ${!n.read ? 'text-gray-900 font-medium' : 'text-gray-600'} line-clamp-2 text-right`}>
//           {n.message}
//         </p>
//         <p className="text-xs text-gray-400 mt-1 text-right">
//           {timeAgo(n.createdAt)}
//         </p>
//       </div>

//       <ChevronLeft className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
//     </div>
//   );

//   return (
//     <>
//       {/* Invisible backdrop to capture clicks outside the dropdown */}
//       <div 
//         className="fixed inset-0 z-[9998] bg-transparent" 
//         onClick={onClose} 
//       />

//       <div 
//         className="
//           fixed top-[70px] left-4 md:left-10 
//           w-[calc(100vw-32px)] md:w-96 
//           bg-white rounded-2xl shadow-2xl border border-gray-100 
//           overflow-hidden z-[9999] 
//           animate-[dropdown-in_0.2s_ease-out]
//         "
//         dir="rtl"
//       >
//         {/* Header */}
//         <div className="px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Bell className="w-5 h-5 text-gray-600" />
//               <h3 className="font-semibold text-gray-900">الإشعارات</h3>
//             </div>
//             {notifications.length > 0 && (
//               <button
//                 onClick={handleViewAll}
//                 className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
//               >
//                 عرض الكل
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="max-h-[480px] overflow-y-auto">
//           {isLoading ? (
//             <div className="p-8 text-center">
//               <div className="animate-pulse flex flex-col items-center gap-3">
//                 <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
//                 <div className="h-4 w-32 bg-gray-100 rounded"></div>
//               </div>
//             </div>
//           ) : notifications.length === 0 ? (
//             <div className="p-8 text-center">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <Bell className="w-8 h-8 text-gray-300" />
//               </div>
//               <p className="text-gray-500">لا توجد إشعارات جديدة</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-50">
//               {today.length > 0 && (
//                 <div>
//                   <div className="px-4 py-2 bg-gray-50/50">
//                     <span className="text-xs font-medium text-gray-500">اليوم</span>
//                   </div>
//                   {today.map(renderNotificationItem)}
//                 </div>
//               )}
//               {yesterday.length > 0 && (
//                 <div>
//                   <div className="px-4 py-2 bg-gray-50/50">
//                     <span className="text-xs font-medium text-gray-500">أمس</span>
//                   </div>
//                   {yesterday.map(renderNotificationItem)}
//                 </div>
//               )}
//               {older.length > 0 && (
//                 <div>
//                   <div className="px-4 py-2 bg-gray-50/50">
//                     <span className="text-xs font-medium text-gray-500">سابقاً</span>
//                   </div>
//                   {older.map(renderNotificationItem)}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         {!isLoading && notifications.length > 0 && (
//           <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
//             <button
//               onClick={handleViewAll}
//               className="w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium py-1 transition-colors cursor-pointer"
//             >
//               عرض جميع الإشعارات
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
















import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft } from 'lucide-react';
import { getMyNotifications, markAsRead } from '../../api/notificationApi';

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

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `منذ ${days} يوم`;
  const weeks = Math.floor(days / 7);
  return `منذ ${weeks} أسبوع`;
}

export default function NotificationDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications-dropdown'],
    queryFn: () => getMyNotifications({ limit: 5 }),
    enabled: isOpen,
    staleTime: 30_000,
  });

  const notifications = data?.data?.data?.data || [];

  const { mutate: markRead } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-dropdown'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const handleClick = (notif) => {
    if (!notif.read) markRead(notif._id);
    onClose();
    if (notif.link) navigate(notif.link);
  };

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  if (!isOpen) return null;

  const today = [];
  const yesterday = [];
  const older = [];
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.createdAt);
    if (notifDate >= todayStart) today.push(notif);
    else if (notifDate >= yesterdayStart) yesterday.push(notif);
    else older.push(notif);
  });

  const renderNotificationItem = (n) => (
    <div
      key={n._id}
      onClick={() => handleClick(n)}
      className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${!n.read ? 'bg-orange-50/30' : ''}`}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${typeColors[n.type]}15` }}>
        <span className="text-xl">{typeIcons[n.type] || '🔔'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${typeColors[n.type]}15`, color: typeColors[n.type] }}>
            {typeLabels[n.type] || n.type}
          </span>
          {!n.read && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
        </div>
        <p className={`text-sm ${!n.read ? 'text-gray-900 font-medium' : 'text-gray-600'} line-clamp-2 text-right`}>{n.message}</p>
        <p className="text-xs text-gray-400 mt-1 text-right">{timeAgo(n.createdAt)}</p>
      </div>
      <ChevronLeft className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-transparent" onClick={onClose} />
      <div 
        className="fixed top-[75px] left-4 md:left-12 w-[calc(100vw-32px)] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
        dir="rtl"
      >
        <div className="px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">الإشعارات</h3>
          </div>
          {notifications.length > 0 && (
            <button onClick={handleViewAll} className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">عرض الكل</button>
          )}
        </div>
        <div className="max-h-[480px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center animate-pulse"><div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3"></div><div className="h-4 w-32 bg-gray-100 rounded mx-auto"></div></div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center"><Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">لا توجد إشعارات جديدة</p></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {today.length > 0 && (<div><div className="px-4 py-2 bg-gray-50/50 text-xs font-medium text-gray-500">اليوم</div>{today.map(renderNotificationItem)}</div>)}
              {yesterday.length > 0 && (<div><div className="px-4 py-2 bg-gray-50/50 text-xs font-medium text-gray-500">أمس</div>{yesterday.map(renderNotificationItem)}</div>)}
              {older.length > 0 && (<div><div className="px-4 py-2 bg-gray-50/50 text-xs font-medium text-gray-500">سابقاً</div>{older.map(renderNotificationItem)}</div>)}
            </div>
          )}
        </div>
        {!isLoading && notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <button onClick={handleViewAll} className="w-full text-center text-sm text-orange-500 font-medium py-1 transition-colors">عرض جميع الإشعارات</button>
          </div>
        )}
      </div>
    </>
  );
}