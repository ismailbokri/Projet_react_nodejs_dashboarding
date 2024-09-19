import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './campar.scss';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getISOWeek, startOfISOWeek, format } from 'date-fns';

const customIcon1 = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/2776/2776067.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/6964/6964720.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const ComparisonComponent = ({ aspect, title }) => {
  const [competitorlbls, setCompetitorlbls] = useState([]);
  const [extractdate, setextractdate] = useState([]);
  const [selectedextractdate, setSelectedextractdate] = useState('');
  const [selectedistance, setSelecteddistance] = useState('');
  const [competitorshortlbls, setCompetitorshortlbls] = useState([]);
  const [selectedCompetitorlbl, setSelectedCompetitorlbl] = useState('');
  const [selectedCompetitorshortlbl, setSelectedCompetitorshortlbl] = useState('');
  const [competitorData, setCompetitorData] = useState([]);
  const [distinctCompetitorlbls, setDistinctCompetitorlbls] = useState([]);
  const [distinctCompetitorlbls2, setDistinctCompetitorlbls2] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/competitorlbls')
      .then(response => setCompetitorlbls(response.data))
      .catch(error => console.error('Error fetching competitorlbls', error));
  }, []);





  useEffect(() => {
    if (selectedCompetitorlbl) {
      axios.get(`http://localhost:5000/api/competitorshortlbls?competitorlbl=${selectedCompetitorlbl}`)
        .then(response => setCompetitorshortlbls(response.data))
        .catch(error => console.error('Error fetching competitorshortlbls', error));
    }
  }, [selectedCompetitorlbl]);



  
  useEffect(() => {
    axios.get('http://localhost:5000/api/extractdate', {
      params: {
        competitorlbl: selectedCompetitorlbl,
        competitorshortlbl: selectedCompetitorshortlbl,
      }
    })
      .then(response => setextractdate(response.data))
      .catch(error => console.error('Error fetching extractdate', error));
  }, [selectedCompetitorlbl,selectedCompetitorshortlbl]);


  const handleCompare = () => {
    setCompetitorData([]); // Clear previous data
  
    // First API call to get comparison data
    axios.get('http://localhost:5000/api/comparison-data', {
      params: {
        competitorlbl: selectedCompetitorlbl,
        competitorshortlbl: selectedCompetitorshortlbl,
        extractdate: selectedextractdate,
        distance: selectedistance
      }
    })
    .then(response => {
      const { competitorData } = response.data;
  
      // Second API call to get selected competitor data
      axios.get('http://localhost:5000/api/selectedcompa', {
        params: {
          competitorlbl: selectedCompetitorlbl,
          competitorshortlbl: selectedCompetitorshortlbl,
          extractdate: selectedextractdate,
        }
      })
      .then(response2 => {
        // Access competitorData correctly
        const selectedCompaData = response2.data.competitorData;
  
        if (Array.isArray(selectedCompaData)) {
          // Combine selectedCompaData at the start of competitorData
          const combinedData = [...selectedCompaData, ...competitorData];
          setCompetitorData(combinedData);
  
          // Extract distinct labels
          const distinctLabels = [...new Set(combinedData.map(data => data.roomcategoryid))];
          setDistinctCompetitorlbls(distinctLabels);
  
          const distinctLabels2 = [...new Set(combinedData.map(data => data.campingid))];
          setDistinctCompetitorlbls2(distinctLabels2);
        } else {
          console.error("selectedCompaData is not an array");
        }
      })
      .catch(error => {
        console.error("Error fetching selected competitor data:", error);
      });
  
    })
    .catch(error => {
      console.error("Error fetching comparison data:", error);
    });
  };
  

useEffect(() => {
  if (distinctCompetitorlbls.length > 0) {
    const fetchData = async () => {
      try {
        const allChartData = [];

        for (let i = 0; i < distinctCompetitorlbls.length && i < 10; i++) {
          const temp = distinctCompetitorlbls[i];
          const response = await axios.get(`http://localhost:5000/api/competitorlbls/${temp}`);
          const rawData = response.data;

          const chartData = [];
          let previousPrice = 0;

          rawData.forEach(item => {
            const arrivalDate = new Date(item.arrivaldate);
            const weekStart = startOfISOWeek(arrivalDate); // Obtenir le début de la semaine ISO
            const weekLabel = format(weekStart, 'yyyy-MM-dd'); // Formater la date du début de la semaine

            // Utiliser le prix actuel ou le précédent si -1
            const price = item.price === -1 ? previousPrice : item.price;
            previousPrice = price;

            chartData.push({
              name: weekLabel,
              [`Prix${i + 1}`]: price,
              [`competitorshortName${i + 1}`]: item.competitorshortlbl || null,
              [`competitorName${i + 1}`]: item.competitorlbl || null
            });
          });

          allChartData.push(chartData);
        }

        // Fusionner les données du graphique par date de semaine
        const mergedData = [];
        allChartData.forEach(chartData => {
          chartData.forEach(item => {
            const existingItemIndex = mergedData.findIndex(data => data.name === item.name);
            if (existingItemIndex >= 0) {
              // Si la semaine existe déjà, fusionner les données
              Object.assign(mergedData[existingItemIndex], item);
            } else {
              // Sinon, ajouter la nouvelle entrée
              mergedData.push(item);
            }
          });
        });

        setData(mergedData);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching chart data', error);
      }
    };

    fetchData();
  }
}, [distinctCompetitorlbls]);



useEffect(() => {
  if (distinctCompetitorlbls2.length > 0) {
    const fetchData = async () => {
      try {
        const fetchPromises = [];

        for (let i = 0; i < distinctCompetitorlbls2.length ; i++) {
          const temp = distinctCompetitorlbls2[i];
          const fetchPromise = axios.get(`http://localhost:5000/api/map-data/mm/${temp}`);
          fetchPromises.push(fetchPromise);
        }

        const allResponses = await Promise.all(fetchPromises); // Collect all responses
        const allData = allResponses.map(response => response.data); // Extract data from each response
        setMapData(allData.flat()); // Flatten the array if needed
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }
}, [distinctCompetitorlbls2]);




  // Colors array for different lines
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8884d8', '#82ca9d'];

  return (
    <div className="comparison-container">
      <div className="dropdown-container">
        {/* Dropdowns for competitor labels, extract date, and distance */}
        <div className="dropdown-pair">
          <div className="dropdown-item">
            <label htmlFor="competitorlbl">Sélectionner le nom du camping:</label>
            <select
              id="competitorlbl"
              value={selectedCompetitorlbl}
              onChange={(e) => setSelectedCompetitorlbl(e.target.value)}
            >
              <option value="">Select Competitor Label</option>
              {competitorlbls.map(lbl => (
                <option key={lbl} value={lbl}>{lbl}</option>
              ))}
            </select>
          </div>

          <div className="dropdown-item">
            <label htmlFor="competitorshortlbl">Sélectionner le nom du l'hébergement:</label>
            <select
              id="competitorshortlbl"
              value={selectedCompetitorshortlbl}
              onChange={(e) => setSelectedCompetitorshortlbl(e.target.value)}
            >
              <option value="">Select Competitor Short Label</option>
              {competitorshortlbls.map(lbl => (
                <option key={lbl} value={lbl}>{lbl}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="dropdown-pair">
          <div className="dropdown-item">
            <label htmlFor="extractdate">Sélectionner la date d'extraction:</label>
            <select
              id="extractdate"
              value={selectedextractdate}
              onChange={(e) => setSelectedextractdate(e.target.value)}
            >
              <option value="">Select date</option>
              {extractdate.map(date => (
                <option key={date} value={date}>{new Date(date).toISOString().split('T')[0]}</option>
              ))}
            </select>
          </div>

          <div className="dropdown-item">
            <label htmlFor="distance">Sélectionner l'echelle du distance :</label>
            <select
              id="distance"
              value={selectedistance}
              onChange={(e) => setSelecteddistance(e.target.value)}
            >
              <option key="100" value="100">courte (0 Km-50 KM) </option>
              <option key="250" value="250">moyenne(0 Km-100 KM)</option>
              <option key="500" value="500">Loin(0 Km-250 KM)</option>
            </select>
          </div>
        </div>
      </div>

      <button className="compare-button" onClick={handleCompare}>Comparer</button>

      <div>
  {error ? (
    <p style={{ backgroundColor: 'grey', color: 'white' }}>Error: {error}</p>
  ) : (
    <ResponsiveContainer width="100%" height={800}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={({ payload }) =>
          payload && payload.length ? (
            <div className="custom-tooltip" style={{ textAlign: 'center' }}>
              {payload.map((entry, index) => (
                <div key={index} style={{ backgroundColor: 'grey', color: 'white', padding: '5px', borderRadius: '5px' }}>
                  <p>{`${entry.payload[`competitorName${index + 1}`]} - ${entry.payload[`competitorshortName${index + 1}`] || 'N/A'}`}</p>
                  <p>{`Prix: ${entry.value} $`}</p>
                </div>
              ))}
            </div>
          ) : null
        } />
        <Legend />
        {distinctCompetitorlbls.slice(0, 10).map((lbl, index) => (
          <Line
            key={lbl}
            type="monotone"
            dataKey={`Prix${index + 1}`}
            stroke={colors[index % colors.length]}
            strokeWidth={index === 0 ? 4 : 2}
            connectNulls={false} // Ajout de cette ligne pour éviter l'affichage continu des données manquantes
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )}
</div>



      {/* Table for competitor data */}
      <table className="comparison-table table">
        <thead>
          <tr>
            <th>Nom de camping</th>
            <th>Nom d'hébergement</th>
            <th>Nombre d'étoiles</th>
            <th>Surface</th>
            <th>Nombre des chambres</th>
            <th>Nombre des invité</th>
            <th>Prix</th>
            <th>Distance</th>
          </tr>
        </thead>
        
        <tbody>
          {competitorData.slice(0, 10).map(data => (
            <tr key={data.competitorlbl}>
              <td>{data.competitorlbl || 'pas mentionné'}</td>
              <td>{data.competitorshortlbl || 'pas mentionné'}</td>
              <td>{data.nbstars === '-1' || data.nbstars === null ? '---' : data.nbstars}</td>
              <td>{data.area === '-1' || data.area === null ? '---' : data.area}</td>
              <td>{data.nbroom === '-1'|| data.nbroom === null ? '---' : data.nbroom}</td>
              <td>{data.nbguest === '-1' || data.nbguest === null ? '---' : data.nbguest}</td>
              <td>{data.price === '-1' || data.price === null ? '---' : `${data.price} $`}</td>
              <td>{data.distance_km === 'NaN' ||data.distance_km === 0 || data.distance_km === null ? 'Mème camping' : `${Math.trunc(data.distance_km)} km`}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="map-container">
      <h1>Carte géologique</h1>

      <MapContainer center={[44.505, 5.09]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mapData.map((data, index) => (
          <Marker
            key={data.id || index}
            position={[data.latitude, data.longitude]}
            icon={data.competitorlbl === selectedCompetitorlbl ? customIcon : customIcon1}
          >
            <Popup>
              {data.competitorlbl}
              <br />
              {data.numberofstars} stars / {data.note}/10
              <br />
              {data.city} - {data.region} - {data.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>

</div>

  );
};

export default ComparisonComponent;
