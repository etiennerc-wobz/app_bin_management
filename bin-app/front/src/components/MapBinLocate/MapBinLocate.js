import React, { useEffect, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { AuthContext } from '../AuthContext/AuthContext';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';

const MapBinLocate = ({ open, bin, onClose, locationPicked }) => {

    const { user } = useContext(AuthContext);
    const [location, setLocation] = useState(null);

    const handleClose = () => {
        onClose();
    }

    const handleValidate = () => {
        locationPicked(location);
        onClose();
    }

    useEffect(() => {
        console.log("location", location);
    }, [location]);

    useEffect(() => {
        if (!open) return;
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JlZ29pcmVtdWxsZXIiLCJhIjoiY2x4dnJubm9iMG9oZjJsc2dtZ281N3VzZiJ9.H_bx7U5CwGOjxDM7LP8nUQ';
        const map = new mapboxgl.Map({
            container: 'mapBin', // container ID
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [bin.lon ?? 4.85, bin.lat ?? 45.75], // starting position [lng, lat]
            zoom: bin.lon ? 13 : 11, // zoom level depends on whether bin.lon is defined
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
                if (bin.lon && bin.lat) {
                    map.addSource('points', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [
                                {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [bin.lon, bin.lat]
                                    },
                                    'properties': {
                                        'title': bin.name,
                                        'id': bin.id
                                    }

                                }
                            ]
                        }
                    });
                }
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    layout: {
                        "icon-allow-overlap": true,
                        "text-allow-overlap": true,
                        'icon-image': 'custom-marker',
                        'icon-size': 0.8,
                        'icon-anchor': 'bottom',
                        'text-field': ['get', 'title'],
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-offset': [0, 0],
                        'text-anchor': 'top'
                    }
                });



            }
            );




        });

        map.on("click", function (e) {

            if (map.getLayer('pinsLayer')) {
                map.removeLayer('pinsLayer');
            }
            if (map.getSource('pins')) {
                map.removeSource('pins');
            }

            var geojson = {
                type: "FeatureCollection",
                features: [{
                    type: "Feature",
                    geometry: { type: "Point", coordinates: [e.lngLat.lng, e.lngLat.lat] }
                }]
            };

            setLocation(geojson.features[0].geometry.coordinates);

            map.addSource("pins", {
                "type": "geojson",
                "data": geojson
            });
            map.addLayer({
                id: "pinsLayer",
                type: "circle",
                source: "pins",
                paint: {
                    "circle-color": "blue",
                    "circle-radius": 8
                }
            });
        });


    }, [bin, open]);

    if (!open) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="relative w-[80%] h-[60%] bg-white border-2 border-gray-800 rounded-lg">
                <div id="mapBin" className="w-full h-full rounded-lg" />
            </div>
            <div className="mt-4 flex justify-center space-x-4">
                <Button
                    sx={{
                        zIndex: 1000,
                        backgroundColor: 'green',
                        color: 'white',
                        borderRadius: '20%',
                        '&:hover': {
                            backgroundColor: 'darkgreen',
                            transform: 'scale(1.1)',
                        }
                    }}
                    onClick={() => handleValidate()}
                >
                    <WhereToVoteIcon />
                    <span className="sm:inline hidden">Valider</span>
                </Button>
                <Button
                    sx={{
                        zIndex: 1000,
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '20%',
                        '&:hover': {
                            backgroundColor: 'darkred',
                            transform: 'scale(1.1)',
                        }
                    }}
                    onClick={() => handleClose()}
                >
                    <CloseIcon />
                    <span className="sm:inline hidden">Annuler</span>
                </Button>
            </div>
        </div>
    );
};

export default MapBinLocate;
