import api from './axios';

// ── Conversations ──

export const getConversations = async () => {
  const res = await api.get('/chat/conversations');
  return res.data.data.conversations;
};

export const createConversation = async (title = 'محادثة جديدة') => {
  const res = await api.post('/chat/conversations', { title });
  return res.data.data.conversation;
};

export const deleteConversation = async (id) => {
  await api.delete(`/chat/conversations/${id}`);
};

// ── Messages ──

export const sendMessage = async (conversationId, message, imageFile = null) => {
  const formData = new FormData();
  if (message) formData.append('message', message);
  if (imageFile) formData.append('image', imageFile);

  const res = await api.post(`/chat/conversations/${conversationId}/message`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const getChatHistory = async (conversationId, limit = 50) => {
  const res = await api.get(`/chat/conversations/${conversationId}/history?limit=${limit}`);
  return res.data.data.messages;
};

export const clearChatHistory = async (conversationId) => {
  await api.delete(`/chat/conversations/${conversationId}/history`);
};
