import api from './axios';

export const getAllPosts = (params) => api.get('/posts', { params });

export const getPost = (id) => api.get(`/posts/${id}`);

export const createPost = (data) => api.post('/posts', data);

export const deletePost = (id) => api.delete(`/posts/${id}`);

export const getComments = (postId) =>
  api.get(`/posts/${postId}/comments`);

export const createComment = (postId, data) =>
  api.post(`/posts/${postId}/comments`, data);

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);

export const toggleLike = (postId) => api.post(`/posts/${postId}/likes`);
