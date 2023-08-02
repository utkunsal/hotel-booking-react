import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet'; 

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MyMap = ({ locations, selectedLocation, handleLocationChange }) => {
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    const geocodeLocations = async () => {
      try {
        const markersToAdd = [];
        for (const location of locations) {
          if (!location.includes(',')) {
            const response = await axios.get(`https://restcountries.com/v3/name/${location}`);
            const countryData = response.data[0];
  
            markersToAdd.push({
              name: location,
              lat: countryData.latlng[0],
              lng: countryData.latlng[1]
            });
          }
        }
        setMarkers(markersToAdd);
      } catch (error) {
        console.error('Error geocoding:', error);
      }
    };
    geocodeLocations();
  }, [locations]);

  useEffect(() => {
    if (selectedLocation) {
      const selectedMarker = markers.find((marker) => marker.name === (selectedLocation.includes(", ") ? selectedLocation.split(", ")[1] : selectedLocation));
      if (selectedMarker) {
        mapRef.current.setView([selectedMarker.lat, selectedMarker.lng], 5); 
      }
    }
  }, [selectedLocation, markers]);
  

  return (
    <>
      <MapContainer
        ref={mapRef}
        center={[35, 10]}
        zoom={2}
        style={{ height: '450px', width: '100%'}}
        scrollWheelZoom={true}       
        className='map'
      >
        <TileLayer 
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            eventHandlers={{
              click: () => {
                handleLocationChange(location.name)
              },
            }}
            icon={defaultIcon} 
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default MyMap;


const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
