import api from './axios';

export const getAllLevels = () => api.get('/levels');

export const getLevel = (id) => api.get(`/levels/${id}`);

export const getLevelLessons = (levelId) => api.get(`/levels/${levelId}/lessons`);

export const createLevel = (data) => api.post('/levels', data);

export const updateLevel = (id, data) => api.patch(`/levels/${id}`, data);

export const deleteLevel = (id) => api.delete(`/levels/${id}`);
