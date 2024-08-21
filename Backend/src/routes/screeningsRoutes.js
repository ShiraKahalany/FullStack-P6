const express = require('express');
const router = express.Router();
const screeningsController = require('../controllers/screeningsController');

// CRUD routes for screenings
router.get('/', screeningsController.getAllScreenings);
router.get('/:id', screeningsController.getScreeningById);
router.post('/', screeningsController.createScreening);
router.put('/:id', screeningsController.updateScreening);
router.delete('/:id', screeningsController.deleteScreening);

module.exports = router;
