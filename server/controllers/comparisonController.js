const db = require('../models/db');

// Controller function to fetch all competitor labels
exports.getCompetitorlbls = async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT competitorlbl FROM competitor_data');
    res.json(result.rows.map(row => row.competitorlbl)); // Return only the competitorlbls
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getextractdate = async (req, res) => {
  try {
    const { competitorlbl,competitorshortlbl} = req.query;
    const result = await db.query('SELECT DISTINCT extractdate FROM camping_data where cast( accomodationid as varchar )= (select roomcategoryid from competitor_data where competitorshortlbl =$2 and competitorlbl=$1)', [competitorlbl,competitorshortlbl]);
    res.json(result.rows.map(row => row.extractdate));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }};




// Controller function to fetch competitorshortlbls based on competitorlbl
exports.getCompetitorshortlbls = async (req, res) => {
  try {
    const { competitorlbl } = req.query;
    const result = await db.query('SELECT DISTINCT competitorshortlbl FROM competitor_data WHERE competitorlbl = $1', [competitorlbl]);
    res.json(result.rows.map(row => row.competitorshortlbl));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to fetch competitorshortlbls based on competitorlbl
exports.getCompetitor1 = async (req, res) => {
  try {
    const { competitorlbl, competitorshortlbl,extractdate} = req.query;

    const result = await db.query(`SELECT  
    a1.competitorlbl,
    a1.competitorshortlbl, 
    a1.roomcategoryid, 
    a1.nbroom, 
    cs1.numberofstars AS nbstars,
    a1.bathroom, 
    a1.nbguest, 
    a1.area, 
    a3.price,
    a3.arrivaldate,
    a3.extractdate,
    a3.campingid
FROM 
    competitor_data a1
JOIN 
    camping_data a3 ON a1.roomcategoryid = CAST(a3.accomodationid AS VARCHAR)
  JOIN 
    camping_sites cs1 ON CAST(cs1.campingid AS INTEGER) = CAST(a1.competitorid AS INTEGER)    
WHERE 
    a1.competitorlbl = $1 
    AND a1.competitorshortlbl = $2
    AND a3.extractdate = TO_DATE(SUBSTRING($3 FROM 1 FOR 10), 'YYYY-MM-DD')
    LIMIT 1;
    `, [competitorlbl,competitorshortlbl,extractdate]);


    res.json({ competitorData: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Controller function to handle comparison data
exports.getComparisonData = async (req, res) => {
  try {
    const { competitorlbl, competitorshortlbl,extractdate,distance } = req.query;
    // Validate inputs
    if (!competitorlbl || !competitorshortlbl|| !extractdate|| !distance ) {
      console.log({ error: `Missing required query parameters` });
    }

    if (distance == "250") {
      diss = 100;
    } else if (distance == "100") {
      diss = 50;
    } else if (distance == "500") {
      diss = 250;
    }
    console.log('Received request for comparison data:', { competitorlbl, competitorshortlbl,extractdate,diss});
    const competitorDataQuery = `
    SELECT DISTINCT ON (
      a1.competitorlbl, 
      a1.roomcategoryid, 
      a1.nbroom, 
      a1.nbstars , 
      a1.bathroom, 
      a1.ac, 
      a1.area, 
      a1.terrace,
      d.distance_km, 
      a3.extractdate
  ) 
  a1.competitorlbl,
  a1.competitorshortlbl, 
  a1.roomcategoryid, 
  a1.nbroom, 
  a1.bathroom, 
  a1.nbguest, 
  a1.ac, 
  a1.area, 
  a1.terrace, 
  a3.price,
  cs1.campingid,
  cs1.numberofstars AS nbstars,
  a3.arrivaldate,
  d.distance_km
FROM 
  camping_data a3 
JOIN 
  competitor_data a1 ON a1.roomcategoryid = CAST(a3.accomodationid AS VARCHAR)
JOIN 
  camping_sites cs1 ON CAST(cs1.campingid AS INTEGER) = CAST(a1.competitorid AS INTEGER)
JOIN 
  (
      SELECT 
          cs1.campingid,
          (
              6371 * acos(
                  cos(radians(CAST(cs1.latitude AS DOUBLE PRECISION))) * 
                  cos(radians(CAST(cs2.latitude AS DOUBLE PRECISION))) *
                  cos(radians(CAST(cs2.longitude AS DOUBLE PRECISION)) - radians(CAST(cs1.longitude AS DOUBLE PRECISION))) +
                  sin(radians(CAST(cs1.latitude AS DOUBLE PRECISION))) * 
                  sin(radians(CAST(cs2.latitude AS DOUBLE PRECISION)))
              )
          ) AS distance_km
      FROM 
          camping_sites cs1,
          (SELECT latitude, longitude 
           FROM public.camping_sites 
           WHERE CAST(campingid AS INTEGER) = 
              (SELECT CAST(competitorid AS INTEGER) 
               FROM public.competitor_data 
               WHERE competitorlbl = $1 
               LIMIT 1)
          ) cs2
      WHERE CAST(cs1.campingid AS INTEGER) != 
          (SELECT CAST(competitorid AS INTEGER) 
           FROM public.competitor_data 
           WHERE competitorlbl = $1 
           LIMIT 1)
  ) d ON CAST(cs1.campingid AS INTEGER) = CAST(d.campingid AS INTEGER)
WHERE 
    (CAST(ROUND(CAST(cs1.numberofstars AS NUMERIC)) AS INTEGER) = (
          SELECT CAST(ROUND(CAST(numberofstars AS NUMERIC)) AS INTEGER) 
          FROM camping_sites
          WHERE CAST(campingid AS INTEGER) = 
          (SELECT CAST(competitorid AS INTEGER) 
           FROM competitor_data 
           WHERE competitorlbl = $1 
           LIMIT 1)
      )
      OR CAST(ROUND(CAST(cs1.numberofstars AS NUMERIC)) AS INTEGER) = (
          SELECT CAST(ROUND(CAST(numberofstars AS NUMERIC)) AS INTEGER) 
          FROM camping_sites
          WHERE CAST(campingid AS INTEGER) = 
          (SELECT CAST(competitorid AS INTEGER) 
           FROM competitor_data 
           WHERE competitorlbl = $1 
           LIMIT 1)
      ) + 1
      OR CAST(ROUND(CAST(cs1.numberofstars AS NUMERIC)) AS INTEGER) = (
          SELECT CAST(ROUND(CAST(numberofstars AS NUMERIC)) AS INTEGER) 
          FROM camping_sites
          WHERE CAST(campingid AS INTEGER) = 
          (SELECT CAST(competitorid AS INTEGER) 
           FROM competitor_data 
           WHERE competitorlbl = $1 
           LIMIT 1)
      ) - 1
)
  AND a3.extractdate = TO_DATE(SUBSTRING($3 FROM 1 FOR 10), 'YYYY-MM-DD') 
  AND d.distance_km < $4
  AND CAST(a1.nbguest AS VARCHAR) = (
      SELECT CAST(nbguest AS VARCHAR) 
      FROM competitor_data 
      WHERE competitorlbl = $1 AND competitorshortlbl = $2
  )
  AND (
      a1.area = (SELECT area FROM competitor_data WHERE competitorlbl = $1 AND competitorshortlbl = $2)
      OR (
          a1.area ~ '^(\d+(\.\d+)?|\d*\.\d+)([ ]?m².*)?$'
          AND (SELECT area FROM competitor_data WHERE competitorlbl = $1 AND competitorshortlbl = $2) ~ '^(\d+(\.\d+)?|\d*\.\d+)([ ]?m².*)?$'
          AND a1.area::text = (SELECT area FROM competitor_data WHERE competitorlbl = $1 AND competitorshortlbl = $2)::text
      )
  )
ORDER BY d.distance_km;

`;


    
    const result = await db.query(competitorDataQuery, [
        competitorlbl, 
        competitorshortlbl, 
        extractdate,
        diss
    ]);


    if (result.rows.length === 0) {
      console.log('No data found for the given parameters.');
      return res.status(404).json({ error: 'No data found for the given parameters.' });
    }

    res.json({ competitorData: result.rows });
  } catch (error) {
    console.error('Error fetching comparison data:', error.message);
    res.status(500).json({ error: error.message });
  }
};


// Controller function to fetch all competitorlbls and competitorids
exports.getCompetitorlbls2 = async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT competitorlbl, competitorid FROM competitor_data');
    res.json(result.rows); // Return the entire row (both competitorlbl and competitorid)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to handle chart data
exports.getchart = async (req, res) => {
  try {
    const { distinctCompetitorlbls } = req.query;

    // Vérifiez si distinctCompetitorlbls est défini
    if (distinctCompetitorlbls) {
        // Vérifiez si distinctCompetitorlbls est déjà un tableau ou une chaîne
        let competitorLabelsList = Array.isArray(distinctCompetitorlbls)
            ? distinctCompetitorlbls
            : distinctCompetitorlbls.split(',');
    
        // Log pour vérifier la liste des labels
        console.log(competitorLabelsList);
    } else {
        // Log si distinctCompetitorlbls est undefined
        console.log('distinctCompetitorlbls is undefined');
    }
    if (!distinctCompetitorlbls || distinctCompetitorlbls.length === 0) {
      return res.status(400).json({ error: 'Competitor labels are required' });
    }

    // Query to join competitor_data and camping_data based on the given competitorlbls
    const result = await db.query(
      `
      SELECT cdata.price, cdata.arrivaldate, cd.competitorlbl
      FROM competitor_data cd
      JOIN camping_data cdata ON cd.competitorid = cdata.campingid
      WHERE cd.competitorlbl = $1
      ORDER BY cdata.arrivaldate
      `,
      [distinctCompetitorlbls]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the given competitor labels' });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Controller function to handle chart data
exports.getmap = async (req, res) => {
  try {
    const { distinctCompetitorlbls2 } = req.query;

    // Vérifiez si distinctCompetitorlbls est défini
    if (distinctCompetitorlbls2) {
        // Vérifiez si distinctCompetitorlbls est déjà un tableau ou une chaîne
        let competitorLabelsList = Array.isArray(distinctCompetitorlbls2)
            ? distinctCompetitorlbls2
            : distinctCompetitorlbls2.split(',');
    
        // Log pour vérifier la liste des labels
        console.log(competitorLabelsList);
    } else {
        // Log si distinctCompetitorlbls est undefined
        console.log('distinctCompetitorlbls is undefined');
    }
    if (!distinctCompetitorlbls2 || distinctCompetitorlbls2.length === 0) {
      return res.status(400).json({ error: 'Competitor labels are required' });
    }

    // Query to join competitor_data and camping_data based on the given competitorlbls
    const result = await db.query(
      ` SELECT * FROM camping_sites 
      WHERE campingid = $1
         GROUP BY region HAVING COUNT(*) > 1) ORDER BY numberofstars DESC, note DESC
      `,
      [distinctCompetitorlbls2]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the given competitor labels' });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
