import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

// Fix default marker icon issue in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultPosition = [23.8103, 90.4125]; // Dhaka

function LocationMarker({ value, onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  if (!value) return null;
  return <Marker position={[value.lat, value.lng]} />;
}

export default function LeafletLocationPicker({ value, onChange }) {
  const mapRef = useRef();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const provider = new OpenStreetMapProvider();

  // Update search bar when value changes (e.g., picked from map)
  useEffect(() => {
    async function updateSearchLabel() {
      if (value && value.lat && value.lng) {
        const results = await provider.search({ query: `${value.lat},${value.lng}` });
        if (results && results.length > 0) {
          setSearch(results[0].label);
        } else {
          setSearch(`${value.lat}, ${value.lng}`);
        }
      }
    }
    updateSearchLabel();
    // eslint-disable-next-line
  }, [value && value.lat, value && value.lng]);

  // Keep map in sync with value
  useEffect(() => {
    if (mapRef.current && value && value.lat && value.lng) {
      mapRef.current.setView([value.lat, value.lng], 15);
    }
  }, [value]);

  // Search handler
  const handleSearch = async (e) => {
    const input = e.target.value;
    setSearch(input);
    if (input.length > 2) {
      const results = await provider.search({ query: input });
      setSearchResults(results);
      // Do NOT update marker here, only update on result click
      // if (results.length > 0 && results[0].label.toLowerCase().includes(input.toLowerCase())) {
      //   onChange({ lat: results[0].y, lng: results[0].x });
      // }
    } else {
      setSearchResults([]);
    }
  };

  // When a result is selected
  const handleResultClick = (result) => {
    setSearch(result.label);
    setSearchResults([]);
    onChange({ lat: result.y, lng: result.x });
    if (mapRef.current) {
      mapRef.current.setView([result.y, result.x], 15);
    }
  };

  const position = value && value.lat && value.lng ? [value.lat, value.lng] : defaultPosition;

  return (
    <div>
      <div style={{ position: 'relative', zIndex: 1000 }}>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search location"
          style={{ width: '100%', padding: '10px', border: '1px solid #e6e6e6', borderRadius: '8px', marginBottom: '4px' }}
        />
        {searchResults.length > 0 && (
          <ul style={{ position: 'absolute', background: '#fff', width: '100%', maxHeight: '180px', overflowY: 'auto', border: '1px solid #e6e6e6', borderRadius: '8px', zIndex: 1001 }}>
            {searchResults.map((result, idx) => (
              <li
                key={idx}
                style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                onClick={() => handleResultClick(result)}
              >
                {result.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <MapContainer
        center={position}
        zoom={15}
        style={{ width: '100%', height: '300px', borderRadius: '8px', marginTop: '10px' }}
        whenCreated={mapInstance => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker value={value} onChange={onChange} />
      </MapContainer>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        Click on the map or search to select your property location.
      </div>
    </div>
  );
}
