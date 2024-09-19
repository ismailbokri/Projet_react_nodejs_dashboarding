const db = require('../models/db');

// Controller function to handle chart data
exports.getChartData = async (req, res) => {
  try {
    // Get the competitorlbl from the request parameters
    const { selectedCompetitorlbl } = req.params;

    if (!selectedCompetitorlbl) {
      return res.status(400).json({ error: 'Competitor label is required' });
    }

    // Query to join competitor_data and camping_data based on the given competitorlbl
    const result = await db.query(
      `
      SELECT c1.price, c1.arrivaldate,c2.competitorshortlbl,c2.competitorlbl
      FROM competitor_data c2
      JOIN camping_data c1 ON c2.roomcategoryid = CAST(c1.accomodationid AS VARCHAR)
      WHERE c1.accomodationid=$1
      ORDER BY c1.arrivaldate 
      `,
      [selectedCompetitorlbl] // Use selectedCompetitorlbl here
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the given competitorlbl' });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
