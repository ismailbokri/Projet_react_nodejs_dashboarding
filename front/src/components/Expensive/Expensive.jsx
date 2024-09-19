import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import "./Expensive.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GlobalContext } from '../../context/GlobalContext'; // Import the context

const Expensive = () => {
  const [price, setPrice] = useState(0); // Initialize price state
  const [loading, setLoading] = useState(true);
  const [shortlbl, setshortlbl] = useState('');
  const [error, setError] = useState(null);
  const { selectedCompetitorlbl } = useContext(GlobalContext); // Access selectedCompetitorlbl from context

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompetitorlbl) {
        setError("Competitor label not selected.");
        setLoading(false);
        return;
      }

      try {
        console.log("Selected Competitor Label:", `http://localhost:5000/api/Expensive/${selectedCompetitorlbl}`);
        const response = await axios.get(`http://localhost:5000/api/Expensive/${selectedCompetitorlbl}`);
        if (response.data && response.data.competitorData.length > 0) {
          const competitor = response.data.competitorData[0];
          setPrice(competitor.price || 0); // Set price from the API response
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
        <p className="title">Price</p>
        <p className="amount">{price}</p>
      </div>
    </div>
  );
};

export default Expensive;
