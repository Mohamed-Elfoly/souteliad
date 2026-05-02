import api from './axios';

export const sendMessage = async (message, imageFile = null) => {
  const formData = new FormData();
  if (message) formData.append('message', message);
  if (imageFile) formData.append('image', imageFile);

  const res = await api.post('/chat/message', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const getChatHistory = async (limit = 50) => {
  const res = await api.get(`/chat/history?limit=${limit}`);
  return res.data.data.messages;
};

export const clearChatHistory = async () => {
  await api.delete('/chat/history');
};
