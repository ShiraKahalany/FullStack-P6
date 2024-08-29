const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// CRUD routes for users
router.get('/user/:id/orders', usersController.getUserOrders);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/tickets/refund/:ticketId', usersController.refundTicket);
router.post('/', usersController.createUser);
router.put('/admin/:id', usersController.updateUserToManager);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.post('/login', usersController.loginUser); 
module.exports = router;
