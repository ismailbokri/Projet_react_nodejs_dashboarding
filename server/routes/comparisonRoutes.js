const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');

router.get('/competitorlbls', comparisonController.getCompetitorlbls);
router.get('/competitorlbls2', comparisonController.getCompetitorlbls2);
router.get('/competitorshortlbls', comparisonController.getCompetitorshortlbls);
router.get('/comparison-data', comparisonController.getComparisonData);
router.get('/extractdate', comparisonController.getextractdate);
router.get('/chart', comparisonController.getchart);
router.get('/selectedcompa', comparisonController.getCompetitor1);

module.exports = router;
