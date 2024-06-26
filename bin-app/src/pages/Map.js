import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const Map = () => {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JlZ29pcmVtdWxsZXIiLCJhIjoiY2x4dnJubm9iMG9oZjJsc2dtZ281N3VzZiJ9.H_bx7U5CwGOjxDM7LP8nUQ';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [4.85, 45.75], // starting position [lng, lat]
      zoom: 11 // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());

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
        if(error) throw error;
        map.addImage('custom-marker', image);
        map.addSource('points', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [4.901472, 45.716701]
                },
                'properties': {
                  'title': 'Bin-Entree'
                }
              },
              {
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [4.897744, 45.717148]
                },
                'properties': {
                  'title': 'Bin-Scene'
                }
              }
            ]
          }
        });
        map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'points',
          layout: {
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
    .setHTML(`<a href="/magic-bins">${e.features[0].properties.title}</a>
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
  }, []);

  return <div id="map" style={{ width: '100%', height: '100vh', zIndex: 0 }} />;
};

export default Map;