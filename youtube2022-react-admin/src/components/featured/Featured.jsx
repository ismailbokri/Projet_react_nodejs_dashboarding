import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const Featured = () => {
  const [currentWeekRevenue, setCurrentWeekRevenue] = useState(0);
  const [nextWeekRevenue, setNextWeekRevenue] = useState(0);
  const [lastWeekRevenue, setLastWeekRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/revenue');
        if (response.data) {
          setCurrentWeekRevenue(response.data.current_week_avg || 0);
          setNextWeekRevenue(response.data.next_week_avg || 0);
          setLastWeekRevenue(response.data.last_week_avg || 0);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentWeekPercentage = ((currentWeekRevenue - lastWeekRevenue) / currentWeekRevenue) * 100;
  const lastWeekPercentage = (lastWeekRevenue / 1000) * 100;
  const nextWeekPercentage = (nextWeekRevenue / 1000) * 100;

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Price Overview</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar 
            value={-currentWeekPercentage} 
            text={`${currentWeekPercentage.toFixed(2)}%`} 
            strokeWidth={5} 
          />
        </div>
        <p className="title">Current Week Price </p>
        <p className="amount">${currentWeekRevenue.toFixed(2)}</p>
        <p className="desc">
        
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Next Week averedge price</div>
            <div className={`itemResult ${nextWeekPercentage >= currentWeekPercentage ? 'positive' : 'negative'}`}>
              {nextWeekPercentage >= currentWeekPercentage ? <KeyboardArrowUpOutlinedIcon fontSize="small"/> : <KeyboardArrowDownIcon fontSize="small"/>}
              <div className="resultAmount">${nextWeekRevenue.toFixed(2)}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week averedge price </div>
            <div className={`itemResult ${lastWeekPercentage >= currentWeekPercentage ? 'positive' : 'negative'}`}>
              {lastWeekPercentage >= currentWeekPercentage ? <KeyboardArrowUpOutlinedIcon fontSize="small"/> : <KeyboardArrowDownIcon fontSize="small"/>}
              <div className="resultAmount">${lastWeekRevenue.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
