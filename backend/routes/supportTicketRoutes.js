const express = require('express');
const supportTicketController = require('../controllers/supportTicketController');
const authController = require('../controllers/authController');

const router = express.Router();

// All routes require authentication
router.use(authController.protect);

// Student routes
router.post('/', supportTicketController.createTicket);
router.get('/my-tickets', supportTicketController.getMyTickets);

// Admin routes
router.get(
  '/admin',
  authController.restrictTo('admin'),
  supportTicketController.getAllTickets
);
router.get(
  '/admin/:id',
  authController.restrictTo('admin'),
  supportTicketController.getTicket
);
router.put(
  '/admin/:id/reply',
  authController.restrictTo('admin'),
  supportTicketController.replyToTicket
);

module.exports = router;
