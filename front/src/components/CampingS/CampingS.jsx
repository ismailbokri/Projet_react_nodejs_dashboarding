import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './chart.scss';
import { GlobalContext } from '../../context/GlobalContext'; // importer le contexte

const CampingS = ({ title }) => {
  const { selectedCompetitorlbl, setSelectedCompetitorlbl } = useContext(GlobalContext);
  const [competitorlbls, setCompetitorlbls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetitorlbls = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/competitorlbls2');
        setCompetitorlbls(response.data);
        if (response.data.length > 0) {
          setSelectedCompetitorlbl(response.data[0].competitorid); // Set the first competitor id as default
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching competitor labels', error);
      }
    };

    fetchCompetitorlbls();
  }, [setSelectedCompetitorlbl]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <select
        className="title"
        value={selectedCompetitorlbl}
        onChange={(e) => setSelectedCompetitorlbl(e.target.value)}
      >
        {competitorlbls.map(({ competitorlbl, competitorid }) => (
          <option key={competitorid} value={competitorid}>
            {competitorlbl}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CampingS;
