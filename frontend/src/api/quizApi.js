import api from './axios';

export const getQuizByLesson = (lessonId) =>
  api.get(`/lessons/${lessonId}/quizzes`);

export const getQuiz = (id) => api.get(`/quizzes/${id}`);

export const createQuiz = (data) => api.post('/quizzes', data);

export const getQuestions = (quizId) =>
  api.get(`/quizzes/${quizId}/questions`);

export const createQuestion = (quizId, data) =>
  api.post(`/quizzes/${quizId}/questions`, data);

export const deleteQuiz = (id) => api.delete(`/quizzes/${id}`);

export const deleteQuestion = (quizId, questionId) =>
  api.delete(`/quizzes/${quizId}/questions/${questionId}`);

export const submitQuizAttempt = (data) => api.post('/quiz-attempts', data);

export const getMyAttempts = () => api.get('/quiz-attempts/my-attempts');
