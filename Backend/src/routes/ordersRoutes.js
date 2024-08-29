const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// CRUD routes for orders
router.get('/tickets', ordersController.getOrdersWithTickets);
router.get('/user/:userId', ordersController.getOrdersByUserId); // New route for fetching orders by userId
router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.delete('/refund/:id', ordersController.refundDeleteOrder);
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
