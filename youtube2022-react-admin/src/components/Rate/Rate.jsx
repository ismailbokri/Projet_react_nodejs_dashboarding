import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import "./Rate.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GlobalContext } from '../../context/GlobalContext'; // Import the context

const Rate = () => {
  const [nbstars, setNbStars] = useState(0); // Initialize nbStars state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shortlbl, setshortlbl] = useState('');
  const { selectedCompetitorlbl } = useContext(GlobalContext); // Access selectedCompetitorlbl from context

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompetitorlbl) {
        setError("Competitor label not selected.");
        setLoading(false);
        return;
      }

      try {
        console.log("Selected Competitor Label:", `http://localhost:5000/api/biggest/${selectedCompetitorlbl}`);
        const response = await axios.get(`http://localhost:5000/api/Rate/${selectedCompetitorlbl}`);
        if (response.data && response.data.competitorData.length > 0) {
          const competitor = response.data.competitorData[0];
          setNbStars(competitor.nbstars || 0); // Set nbstars from the API response
          setshortlbl(competitor.competitorshortlbl);
        } else {
          setError("No data found for the selected competitor.");
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (selectedCompetitorlbl) { // Ensure selectedCompetitorlbl is defined before calling fetchData
      fetchData();
    }
  }, [selectedCompetitorlbl]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="featured">
      <div className="top">
        <p className="amount">{shortlbl}</p>
      </div>
      <div className="bottom">
        <p className="title">Number of Stars</p>
        <p className="amount">{nbstars}</p>
      </div>
    </div>
  );
};

export default Rate;
