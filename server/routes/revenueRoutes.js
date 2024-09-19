// routes/revenueRoutes.js
const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

// Define a route to get revenue data
router.get('/revenue', revenueController.getRevenueData);

module.exports = router;
