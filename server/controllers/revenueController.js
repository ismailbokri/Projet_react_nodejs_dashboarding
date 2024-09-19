const db = require('../models/db'); // Ajustez le chemin vers votre configuration db

exports.getRevenueData = (req, res) => {
  const query = `
    SELECT 
      AVG(CASE WHEN DATE_TRUNC('week', arrivaldate) = DATE_TRUNC('week', CURRENT_DATE) THEN price END) AS current_week_avg,
      AVG(CASE WHEN DATE_TRUNC('week', arrivaldate) = DATE_TRUNC('week', CURRENT_DATE + INTERVAL '1 week') THEN price END) AS next_week_avg,
      AVG(CASE WHEN DATE_TRUNC('week', arrivaldate) = DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week') THEN price END) AS last_week_avg
    FROM camping_data;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching revenue data:', err);
      return res.status(500).json({ error: 'Failed to retrieve revenue data' });
    }
    res.json(results.rows[0]);
  });
};
