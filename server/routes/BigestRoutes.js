const express = require('express');
const router = express.Router();
const BigestController = require('../controllers/BigestController');

// Define a route to get the biggest data with a dynamic parameter
router.get('/biggest/:selectedCompetitorlbl', BigestController.getBiggestData);
router.get('/Expensive/:selectedCompetitorlbl', BigestController.getExpensiveData);
router.get('/Rate/:selectedCompetitorlbl', BigestController.getRateData);
module.exports = router;
