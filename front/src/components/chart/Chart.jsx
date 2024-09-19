import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './chart.scss';
import { GlobalContext } from '../../context/GlobalContext'; // Import the context
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Chart = ({ aspect, title }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { selectedCompetitorlbl } = useContext(GlobalContext);   

  useEffect(() => {
    if (!selectedCompetitorlbl) return;

    const fetchData = async () => {
      try {
        console.log("Selected Competitor Label:", `http://localhost:5000/api/competitorlbls/${selectedCompetitorlbl}`);
        const response = await axios.get(`http://localhost:5000/api/competitorlbls/${selectedCompetitorlbl}`);
        const rawData = response.data;

        const chartData = [];
        let previousPrice = 0; // Start with 0

        if (rawData.length > 0) {
          chartData.push({
            name: new Date(rawData[0].arrivaldate).toLocaleDateString('default', { month: 'short', year: 'numeric' }),
            Total: 0
          });
        }

        rawData.forEach(item => {
          const price = item.price === -1 ? previousPrice : item.price;
          previousPrice = price;
          chartData.push({
            name: new Date(item.arrivaldate).toLocaleDateString('default', { month: 'short', year: 'numeric' }),
            Total: price
          });
        });

        setData(chartData);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching chart data', error);
      }
    };

    fetchData();
  }, [selectedCompetitorlbl]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (    <div className="chart">
      <div className="title">{title || "Price per month"}</div> {/* Using the title prop if provided */}
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={230}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <YAxis stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

};

export default Chart;
