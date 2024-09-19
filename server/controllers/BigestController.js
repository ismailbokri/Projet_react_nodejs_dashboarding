const db = require('../models/db'); // Adjust the path to your DB configuration

exports.getBiggestData = async (req, res) => {
  try {
    const { selectedCompetitorlbl } = req.params;

    if (!selectedCompetitorlbl) {
      return res.status(400).json({ error: 'Competitor label is required' });
    }

    const query = `
      SELECT * 
      FROM public.competitor_data 
      WHERE competitorid = $1
      ORDER BY nbroom DESC, nbguest DESC, terrace DESC, bathroom DESC
      LIMIT 1;
    `;

    const competitorResult = await db.query(query, [selectedCompetitorlbl]);
    
    res.json({
      competitorData: competitorResult.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpensiveData = async (req, res) => {
  try {
    const { selectedCompetitorlbl } = req.params;

    if (!selectedCompetitorlbl) {
      return res.status(400).json({ error: 'Competitor label is required' });
    }

    const query = `

    SELECT DISTINCT
    a1.competitorid,
    a1.competitorshortlbl, 
    a1.roomcategoryid, 
    a1.nbroom, 
    a1.nbstars, 
    a1.bathroom, 
    a1.ac, 
    a1.area, 
    a1.terrace, 
    a3.price
    FROM competitor_data a1
    JOIN camping_data a3 ON a1.roomcategoryid = CAST(a3.accomodationid AS VARCHAR)
      WHERE a1.competitorid = $1
      ORDER BY a3.price;`;

    const competitorResult = await db.query(query, [selectedCompetitorlbl]);
    
    res.json({
      competitorData: competitorResult.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getRateData = async (req, res) => {
  try {
    const { selectedCompetitorlbl } = req.params;

    if (!selectedCompetitorlbl) {
      return res.status(400).json({ error: 'Competitor label is required' });
    }

    const query = `
      SELECT * 
      FROM public.competitor_data 
      WHERE competitorid = $1
      ORDER BY nbstars DESC
      LIMIT 1;
    `;

    const competitorResult = await db.query(query, [selectedCompetitorlbl]);
    
    res.json({
      competitorData: competitorResult.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};