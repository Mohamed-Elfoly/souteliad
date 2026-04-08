import api from './axios';

export const loginApi = (data) => api.post('/users/login', data);

export const signupApi = (data) => api.post('/users/signup', data);

export const forgotPasswordApi = (data) =>
  api.post('/users/forgotPassword', data);

export const resetPasswordApi = (token, data) =>
  api.patch(`/users/resetPassword/${token}`, data);

export const getMeApi = (config) => api.get('/users/me', config);

export const updateMeApi = (data) => api.patch('/users/updateMe', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
});

export const updatePasswordApi = (data) =>
  api.patch('/users/updateMyPassword', data);
