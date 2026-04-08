import api from './axios';

export const getAllReports = (params) => api.get('/reports', { params });

export const createReport = (data) => api.post('/reports', data);

export const updateReport = (id, data) => api.patch(`/reports/${id}`, data);

export const getAllProgressReports = (params) => api.get('/progress-reports', { params });

export const createProgressReport = (data) => api.post('/progress-reports', data);
