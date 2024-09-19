const db = require('../models/db');

// Controller function to handle chart data
exports.getmapD = async (req, res) => {
  try {
    
    const { distinctCompetitorlbls2 } = req.params;

    if (!distinctCompetitorlbls2) {
      return res.status(400).json({ error: 'Competitor label is required isssss' });
    }
      // Adjusting SQL query for multiple competitor IDs


    const result = await db.query(
      `SELECT a1.*, a2.competitorlbl
      FROM camping_sites a1
      JOIN competitor_data a2 
        ON CAST(a1.campingid AS INTEGER) = CAST(a2.competitorid AS INTEGER)
      WHERE a1.campingid = $1 ;
      
      `,
      [distinctCompetitorlbls2] // Use selectedCompetitorlbl here
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the given competitorlbl' });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};
