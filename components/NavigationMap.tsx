
import React, { useEffect, useRef, useState } from 'react';
import Map, { Marker, NavigationControl, Source, Layer, MapRef } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Fix for mapbox-gl transpilation issues in some build environments
// @ts-ignore
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "pk.eyJ1IjoibGFiZXN0aWEiLCJhIjoiY21sMWg4ZHNqMDdpZDNmcHcwcGl0dTJkOCJ9.2oN53ZmBfz5g62OmPeVbAg";

interface NavigationMapProps {
    userLocation: [number, number];
    destination?: [number, number];
    isNavigating: boolean;
    onArrive?: () => void;
}

const NavigationMap: React.FC<NavigationMapProps> = ({ userLocation, destination, isNavigating, onArrive }) => {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState({
        longitude: userLocation[1],
        latitude: userLocation[0],
        zoom: 15,
        pitch: 0,
        bearing: 0
    });

    const [routeConfig, setRouteConfig] = useState<any>(null);
    const [instruction, setInstruction] = useState({ text: "Calculando ruta...", distance: "0 m" });

    useEffect(() => {
        if (isNavigating && destination) {
            const fetchRoute = async () => {
                try {
                    const query = await fetch(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[1]},${userLocation[0]};${destination[1]},${destination[0]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
                        { method: 'GET' }
                    );
                    const json = await query.json();
                    const data = json.routes[0];
                    const route = data.geometry.coordinates;
                    const steps = data.legs[0].steps;

                    // Set route layer data
                    setRouteConfig({
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: route
                        }
                    });

                    // Set initial instruction
                    if (steps.length > 0) {
                        setInstruction({
                            text: steps[0].maneuver.instruction,
                            distance: Math.round(steps[0].distance) + " m"
                        });
                    }

                    // Initial camera fit
                    if (mapRef.current) {
                        // Optional: fit bounds if it's the first load
                    }

                } catch (error) {
                    console.error("Error fetching directions:", error);
                }
            };

            fetchRoute();
        }
    }, [destination, isNavigating]); // Dependency on destination start (userLocation omitted to avoid refetching on every move for now)

    // Effect to handle transition to navigation mode
    useEffect(() => {
        if (isNavigating && mapRef.current) {
            // Smooth transition to driving view
            mapRef.current.flyTo({
                center: [userLocation[1], userLocation[0]],
                zoom: 18,
                pitch: 60, // 3D tilt
                bearing: 0, // Should be updated with device heading
                duration: 2000,
                essential: true
            });
        } else if (!isNavigating && mapRef.current) {
            // Reset to standard 2D view
            mapRef.current.flyTo({
                center: [userLocation[1], userLocation[0]],
                zoom: 15,
                pitch: 0,
                bearing: 0,
                duration: 2000
            });
        }
    }, [isNavigating]);

    // Effect to update camera during navigation (The "Game Loop")
    useEffect(() => {
        if (!isNavigating) return;

        // In a real app, this would be updated by the GPS 'heading' property
        // For now, we just ensure the camera follows the user
        mapRef.current?.flyTo({
            center: [userLocation[1], userLocation[0]],
            duration: 1000,
            padding: { bottom: 200 } // Shift center to bottom for better driving view
        });

    }, [userLocation, isNavigating]);

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11" // Dark mode style
                mapboxAccessToken={mapboxgl.accessToken}
            >
                <NavigationControl position="top-right" />

                {/* User Marker */}
                <Marker longitude={userLocation[1]} latitude={userLocation[0]} anchor="center">
                    <div className="relative">
                        <div className="w-6 h-6 bg-[#47f425] rounded-full border-2 border-white shadow-[0_0_15px_#47f425] z-10 relative"></div>
                        {/* Direction cone (visual only for now) */}
                        {isNavigating && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[30px] border-b-[#47f425]/30"></div>
                        )}
                    </div>
                </Marker>

                {/* Destination Marker */}
                {destination && (
                    <Marker longitude={destination[1]} latitude={destination[0]} color="#ef4444" />
                )}

                {/* Route Line Layer */}
                {routeConfig && (
                    <Source id="route" type="geojson" data={routeConfig}>
                        <Layer
                            id="route"
                            type="line"
                            source="route"
                            layout={{
                                "line-join": "round",
                                "line-cap": "round"
                            }}
                            paint={{
                                "line-color": "#47f425",
                                "line-width": 8,
                                "line-opacity": 0.8,
                                "line-blur": 1
                            }}
                        />
                    </Source>
                )}

            </Map>

            {/* Navigation Overlay (Placeholder) */}
            {isNavigating && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] bg-[#0a0f0a]/90 backdrop-blur-md border border-[#47f425]/30 rounded-2xl p-4 shadow-2xl animate-slide-down">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-4xl text-[#47f425]">turn_right</span>
                        <div>
                            <h3 className="text-white text-xl font-bold font-display">{instruction.text}</h3>
                            <p className="text-gray-400 text-sm">en {instruction.distance}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavigationMap;
