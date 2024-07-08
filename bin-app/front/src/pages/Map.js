import React, { useEffect, useState,useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { getBins, getMyFestivalBins } from '../api';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival } from '../api';

const Map = () => {

  const [bins, setBins] = useState([]);
  const [festivalId, setFestivalId] = useState(0);
  const { user } = useContext(AuthContext);


  const fetchMyFestivalBins = async () => {
    try {
      const bins = await getMyFestivalBins(user.id);
      
      setBins(bins);
    } catch (error) {
      console.error('Error fetching bins:', error);
    }
  }

  useEffect(() => {
    fetchMyFestivalBins();
  }, []);




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

    // Add geolocate control to the map.
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });

    map.addControl(geolocate);

    // Trigger the geolocation control once the map is loaded
    map.on('load', () => {
      
      map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
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
                'id': bin.id
              }
            }))
          }
        });
        map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'points',
          layout: {
            "icon-allow-overlap": true,
            "text-allow-overlap": true,
            'icon-image': 'custom-marker',
            'text-field': ['get', 'title'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 1.25],
            'text-anchor': 'top'
          }
        });

        // Add a popup to the bins
        map.on('click', 'points', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(`<a href="/magic-bins/${e.features[0].properties.id}">${e.features[0].properties.title}</a>
    <style>
    a {
      padding: 5px;
      color: black;
      font-weight: bold;
    }
    `)
            .addTo(map);
        });

      }
      );



    });
  }, [bins]);

    return <div id="map" className="w-full h-[100vh] sm:h-[90vh] mt-0 sm:mt-16 relative z-0" />;
};

export default Map;