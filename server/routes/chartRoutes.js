const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');

// Route to get chart data
router.get('/competitorlbls/:selectedCompetitorlbl', chartController.getChartData);
// Add this to your Express.js backend


module.exports = router;
