const express = require('express');
const { getmapD } = require('../controllers/mapController'); // Correct import for the controller function
const router = express.Router();

router.get('/mm/:distinctCompetitorlbls2', getmapD); // Correct function reference

module.exports = router;
