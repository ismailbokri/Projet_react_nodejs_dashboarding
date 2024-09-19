import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import "./Bigest.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GlobalContext } from '../../context/GlobalContext'; // Import the context

const Biggest = () => {
  const [nbRoom, setNbRoom] = useState(0);
  const [nbGuest, setNbGuest] = useState(0);
  const [area, setArea] = useState('');
  const [shortlbl, setshortlbl] = useState('');
  const [loading, setLoading] = useState(true);
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
        console.log("Selected Competitor Label:", `http://localhost:5000/api/biggest/${selectedCompetitorlbl}`); // Verify the value
        const response = await axios.get(`http://localhost:5000/api/biggest/${selectedCompetitorlbl}`);
        if (response.data && response.data.competitorData.length > 0) {
          const competitor = response.data.competitorData[0];
          setshortlbl(competitor.competitorshortlbl);
          setNbRoom(competitor.nbroom || 0);
          setNbGuest(competitor.nbguest || 0);
          setArea(competitor.area || '');
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
        <p className="title">Number of Rooms</p>
        <p className="amount">{nbRoom}</p>

        <p className="title">Number of Guests</p>
        <p className="amount">{nbGuest}</p>
        <p className="title">Area of Largest Room</p>
        <p className="amount">{area}</p>
      </div>
    </div>
  );
};

export default Biggest;
