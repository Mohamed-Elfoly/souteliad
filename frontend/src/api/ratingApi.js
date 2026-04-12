import api from './axios';

// POST /api/v1/lessons/:lessonId/ratings — user adds a rating to a lesson
export const addRating = (lessonId, rating) =>
  api.post(`/lessons/${lessonId}/ratings`, { rating });

// GET /api/v1/ratings/admin — admin fetches all ratings with student + lesson info
export const getAllRatingsAdmin = (params) =>
  api.get('/ratings/admin', { params });

// GET /api/v1/lessons/:lessonId/ratings/me — get current user's rating for a lesson
export const getMyRating = (lessonId) =>
  api.get(`/lessons/${lessonId}/ratings/me`);