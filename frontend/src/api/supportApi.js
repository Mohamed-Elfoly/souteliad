import api from './axios';

// POST /api/v1/support — authenticated user submits a ticket
export const createTicket = (data) =>
  api.post('/support', data);

// GET /api/v1/support/my-tickets — user views their own tickets
export const getMyTickets = (params) =>
  api.get('/support/my-tickets', { params });

// GET /api/v1/support/admin — admin fetches all tickets
export const getAllTickets = (params) =>
  api.get('/support/admin', { params });

// GET /api/v1/support/admin/:id — admin fetches a single ticket
export const getTicket = (id) =>
  api.get(`/support/admin/${id}`);

// PUT /api/v1/support/admin/:id/reply — admin replies to a ticket
export const replyToTicket = (id, adminReply) =>
  api.put(`/support/admin/${id}/reply`, { adminReply });