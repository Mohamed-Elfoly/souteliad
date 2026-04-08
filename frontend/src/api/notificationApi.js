import api from './axios';

export const getMyNotifications = (params) =>
  api.get('/notifications', { params });

export const markAsRead = (id) =>
  api.patch(`/notifications/${id}`);

export const getUnreadCount = () =>
  api.get('/notifications/unread-count');

export const createNotification = (data) =>
  api.post('/notifications', data);




export const markAllAsRead = () =>
  api.patch('/notifications/mark-all-read');