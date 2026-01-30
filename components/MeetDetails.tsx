
import React from 'react';
import { Meet } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface MeetDetailsProps {
  meet: Meet;
  onClose: () => void;
}

const MeetDetails: React.FC<MeetDetailsProps> = ({ meet, onClose }) => {
  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${meet.latitude},${meet.longitude}`;
    window.open(url, '_blank');
  };

  const startTime = new Date(meet.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(meet.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="absolute inset-x-0 bottom-0 z-[1000] bg-[#111] border-t border-zinc-800 rounded-t-3xl p-6 shadow-2xl transform transition-transform animate-slide-up">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-400 uppercase tracking-widest mb-2">
            {meet.isPrivate ? 'Encuentro de Crew' : 'Encuentro Público'}
          </span>
          <h2 className="text-2xl font-bold font-orbitron text-white leading-none">
            {CATEGORY_ICONS[meet.category]} {meet.name}
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800/50">
          <p className="text-[10px] text-zinc-500 uppercase">Horario</p>
          <p className="text-sm font-medium">{startTime} - {endTime}</p>
        </div>
        <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800/50">
          <p className="text-[10px] text-zinc-500 uppercase">Capacidad</p>
          <p className="text-sm font-medium">{meet.currentVehicles} / {meet.maxVehicles} Vehículos</p>
        </div>
      </div>

      <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
        {meet.description || 'Sin descripción adicional para este encuentro.'}
      </p>

      <button
        onClick={handleGetDirections}
        className="w-full bg-[#1aff00] hover:bg-[#16d900] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#1aff00]/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 12-8-8-8 8"/><path d="M12 4v16"/></svg>
        CÓMO LLEGAR
      </button>
    </div>
  );
};

export default MeetDetails;
