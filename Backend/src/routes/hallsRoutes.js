const express = require('express');
const router = express.Router();
const hallsController = require('../controllers/hallsController');

// CRUD routes for halls
router.get('/', hallsController.getAllHalls);
router.get('/:id', hallsController.getHallById);
router.post('/', hallsController.createHall);
router.put('/:id', hallsController.updateHall);
router.delete('/:id', hallsController.deleteHall);

module.exports = router;
