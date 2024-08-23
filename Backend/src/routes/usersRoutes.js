const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// CRUD routes for users
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

router.post('/login', usersController.loginUser); // <-- Add this line for login

module.exports = router;
