import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapComponent.scss';

// Create a custom icon
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

const MapComponent = () => {
  const [mapData, setMapData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/map-data');
        if (Array.isArray(response.data)) {
          setMapData(response.data);
        } else {
          throw new Error('Data is not an array');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching map data', error);
      }
    };

    fetchData();
  }, []);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const filteredMapData = selectedRegion === 'All'
    ? mapData
    : mapData.filter((data) => data.region === selectedRegion);


  const filteredMapData2 = filteredMapData.sort((a, b) => {
      if (a.numberofstars === b.numberofstars) {
        return a.note - b.note;
      }
      return b.numberofstars - a.numberofstars;
    });

  if (error) {
    return <div className="error-message"></div>;
  }

  const uniqueRegions = [...new Set(mapData.map(data => data.region))];

  return (
    <div className="map-container">
      <h1>Interactive Map</h1>
      <label htmlFor="region-select">Select a region:</label>
      
      <select id="region-select" value={selectedRegion} onChange={handleRegionChange}>
        <option value="All">All</option>
        {uniqueRegions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <MapContainer center={[44.505, 5.09]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredMapData2.map((data, index) => (
          <Marker
            key={data.id || index}
            position={[data.latitude, data.longitude]}
            icon={index === 0 ? customIcon : customIcon1}
          >
            <Popup>
              {data.numberofstars} stars / {data.note}/10
              <br />
              {data.city} / {data.region} / {data.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
