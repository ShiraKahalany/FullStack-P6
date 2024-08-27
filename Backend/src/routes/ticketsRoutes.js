const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

// CRUD routes for tickets
router.get('/screening/:screeningId', ticketsController.getBookedSeatsForScreening);
router.get('/user', ticketsController.getTicketsByUserAndPaymentStatus);
router.get('/', ticketsController.getAllTickets);
router.get('/:id', ticketsController.getTicketById);
router.post('/', ticketsController.createTicket);
router.put('/:id', ticketsController.updateTicket);
router.delete('/:id', ticketsController.deleteTicket);

module.exports = router;
