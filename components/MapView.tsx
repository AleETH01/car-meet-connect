
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Meet, MeetCategory } from '../types';
import { CATEGORY_ICONS } from '../constants';

import NavigationMap from './NavigationMap';

interface MapViewProps {
  meets: Meet[];
  onMarkerClick: (meet: Meet) => void;
  center: [number, number];
  userAccuracy?: number;
  isNavigating?: boolean;
  destination?: [number, number] | null;
  onExitNavigation?: () => void;
}



// Custom User Icon
const userIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-4 h-4 bg-[#2f80ed] rounded-full border-2 border-white shadow-lg z-20"></div>
      <div class="absolute w-12 h-12 bg-[#2f80ed]/30 rounded-full animate-ping z-10"></div>
    </div>
  `,
  className: 'custom-user-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom Marker Creator (Restored)
const createCustomIcon = (category: MeetCategory, isPrivate: boolean, currentVehicles: number) => {
  const emoji = CATEGORY_ICONS[category] || '📍';
  const color = isPrivate ? '#ff0055' : '#47f425'; // Updated to Neon Green

  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Main Marker Circle -->
        <div class="absolute w-10 h-10 rounded-full bg-black/90 border-2 flex items-center justify-center transition-transform hover:scale-110" 
             style="border-color: ${color}; box-shadow: 0 0 15px ${color}60;">
          <div class="z-10 text-xl">${emoji}</div>
        </div>
        
        <!-- Car Count Badge -->
        <div class="absolute -top-1 -right-1 z-20 min-w-[20px] h-5 bg-black border border-${isPrivate ? '[#ff0055]' : '[#47f425]'} rounded-full flex items-center justify-center px-1 shadow-lg"
             style="border-color: ${color};">
          <span class="text-[9px] font-black text-white leading-none">${currentVehicles}</span>
        </div>

        <!-- Pointer Arrow -->
        <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r-2 border-b-2" 
             style="background: black; border-color: ${color};"></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });
};

// Map Resizer (Restored)
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const MapView: React.FC<MapViewProps> = ({
  meets,
  onMarkerClick,
  center,
  userAccuracy = 0,
  isNavigating = false,
  destination,
  onExitNavigation
}) => {

  // ... (keep navigation return block as is) ...

  return (
    <div className="w-full h-full bg-[#0a0f0a] animate-fade-in">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true} // Allow scroll wheel zoom
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapResizer />

        {/* User Location Marker & Accuracy */}
        <Marker position={center} icon={userIcon} zIndexOffset={1000}>
          <Popup>
            <div className="text-black font-bold text-xs">Tu Ubicación</div>
          </Popup>
        </Marker>
        {userAccuracy > 0 && (
          <Circle
            center={center}
            radius={userAccuracy}
            pathOptions={{ color: '#2f80ed', fillColor: '#2f80ed', fillOpacity: 0.1, weight: 1, opacity: 0.5 }}
          />
        )}

        {meets.map((meet) => (
          <Marker
            key={meet.id}
            position={[meet.latitude, meet.longitude]}
            icon={createCustomIcon(meet.category, meet.isPrivate, meet.currentVehicles)}
            eventHandlers={{
              click: () => onMarkerClick(meet),
            }}
          >
            <Popup className="custom-popup">
              <div className="text-white p-1">
                <h3 className="font-bold text-xs mb-0.5">{meet.name}</h3>
                <p className="text-[10px] text-zinc-400 leading-none">${meet.currentVehicles} autos presentes</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-popup .leaflet-popup-content-wrapper {
          background: #161b16 !important;
          color: white !important;
          border-radius: 12px !important;
          border: 1px solid rgba(71, 244, 37, 0.2) !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: #161b16 !important;
          border: 1px solid rgba(71, 244, 37, 0.2) !important;
        }
      `}} />
    </div>
  );
};

export default MapView;
