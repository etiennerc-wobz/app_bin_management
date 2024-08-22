import React, { useEffect, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { getBins, getMyFestivalBins } from '../api';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival } from '../api';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlaceIcon from '@mui/icons-material/Place';

const Map = () => {

  const [bins, setBins] = useState([]);
  const [festivalId, setFestivalId] = useState(0);
  const { user } = useContext(AuthContext);

  // Fetches bins associated with the user's festival
  const fetchMyFestivalBins = async () => {
    try {
      const bins = await getMyFestivalBins(user.id);
      setBins(bins);
    } catch (error) {
      console.error('Error fetching bins:', error);
    }
  }

  // Fetch bins when the component mounts
  useEffect(() => {
    fetchMyFestivalBins();
  }, []);

  // Initialize the map and add bins as markers
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JlZ29pcmVtdWxsZXIiLCJhIjoiY2x4dnJubm9iMG9oZjJsc2dtZ281N3VzZiJ9.H_bx7U5CwGOjxDM7LP8nUQ';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [4.85, 45.75], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.touchPitch.disable();

    // Add geolocate control to the map
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });

    map.addControl(geolocate);

    // Load custom marker image and add bins as markers on the map
    map.on('load', () => {
      map.loadImage('https://cdn-icons-png.flaticon.com/512/484/484167.png', (error, image) => {
        if (error) throw error;
        map.addImage('custom-marker', image);
        map.addSource('points', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': bins.map(bin => ({
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [bin.lon, bin.lat]
              },
              'properties': {
                'title': bin.name,
                'id': bin.id,
                'zone': bin.zone,
                'fillrate': bin.fillrate ? Math.round(bin.fillrate * 100) : -1
              }
            }))
          }
        });
        map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'points',
          layout: {
            'icon-size': 0.07,
            "icon-allow-overlap": true,
            "text-allow-overlap": true,
            'icon-image': 'custom-marker',
            'icon-anchor': 'bottom',
            'text-field': ['get', 'title'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.1],
            'text-anchor': 'top'
          }
        });

        // Add a popup to the bins
        map.on('click', 'points', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(`<a 
            href="/magic-bins/${e.features[0].properties.id}">
            <img src="https://cdn.icon-icons.com/icons2/1863/PNG/512/open-in-new_118850.png" alt="Open in new" style="width: 20px; height: 20px;"/>
            ${e.features[0].properties.title}<br/>
            Zone : ${e.features[0].properties.zone} <br/>
            Remplissage : ${e.features[0].properties.fillrate}%
            </a>
    <style>
    padding: 5px;
    a {
      padding: 5px;
      color: black;
      font-weight: bold;
    }
    `)
            .addTo(map);
        });
      });
    });
  }, [bins]);

  return <div id="map" className="w-full h-[100vh] sm:h-[90vh] mt-0 sm:mt-16 relative z-0" />;
};

export default Map;