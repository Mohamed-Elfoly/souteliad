import api from './axios';

export const getLevels = () => api.get('/levels');

export const getAllLessons = (params) => api.get('/lessons', { params });

export const getLesson = (id) => api.get(`/lessons/${id}`);

export const createLesson = (data) => api.post('/lessons', data);

export const updateLesson = (id, data) => api.patch(`/lessons/${id}`, data);

export const deleteLesson = (id) => api.delete(`/lessons/${id}`);

export const getMyProgress = () => api.get('/progress/my-progress');

export const markLessonComplete = (lessonId) => api.post('/progress', { lessonId });

export const addRating = (lessonId, rating) =>
  api.post(`/lessons/${lessonId}/ratings`, { rating });

export const getMyRating = (lessonId) =>
  api.get(`/lessons/${lessonId}/ratings/me`);
