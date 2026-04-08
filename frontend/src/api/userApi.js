import api from './axios';

export const getAllUsers = (params) => api.get('/users', { params });

export const getTeachersManage = () => api.get('/users/manage-teachers');

export const createUser = (data) => api.post('/users', data);

export const getUser = (id) => api.get(`/users/${id}`);

export const updateUser = (id, data) => api.patch(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getStudentStats = () => api.get('/stats/students');
export const getTeacherDashboardStats = () => api.get('/stats/teacher-dashboard');
