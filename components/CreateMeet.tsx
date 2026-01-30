
import React, { useState } from 'react';
import { MeetCategory, Meet, User } from '../types';

interface CreateMeetProps {
  onCancel: () => void;
  onSubmit: (meetData: Partial<Meet>) => void;
  user: User;
  currentLatLng: [number, number];
}

const CreateMeet: React.FC<CreateMeetProps> = ({ onCancel, onSubmit, user, currentLatLng }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MeetCategory>(MeetCategory.ESTATICA);
  const [description, setDescription] = useState('');
  const [maxVehicles, setMaxVehicles] = useState<number | ''>(50);
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');
  const [addressSearch, setAddressSearch] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startTimeStr || !endTimeStr) return;

    const now = new Date();
    const [sH, sM] = startTimeStr.split(':').map(Number);
    const [eH, eM] = endTimeStr.split(':').map(Number);

    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sH, sM).getTime();
    let endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eH, eM).getTime();

    if (endTime < startTime) {
      endTime += 24 * 60 * 60 * 1000;
    }

    onSubmit({
      name,
      category,
      description,
      startTime,
      endTime,
      latitude: currentLatLng[0],
      longitude: currentLatLng[1],
      maxVehicles: typeof maxVehicles === 'number' ? maxVehicles : 50,
      currentVehicles: 1,
      isPrivate: false,
      creatorId: user.id
    });
  };

  return (
    <div className="absolute inset-0 z-[2000] bg-[#0a0f0a] font-display text-white flex flex-col overflow-hidden animate-fade-in selection:bg-[#47f425]/30">
      {/* Spacer para el área de la barra de estado */}
      <div className="h-10 w-full shrink-0"></div>

      {/* Header Fijo */}
      <header className="sticky top-0 z-50 flex flex-col bg-[#0a0f0a]/95 backdrop-blur-md px-4 py-2 shrink-0">
        <div className="flex items-center justify-between h-14">
          <button onClick={onCancel} className="flex size-10 items-center justify-start text-white active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
          </button>
          <h2 className="text-white text-base font-bold uppercase tracking-[0.2em]">Nuevo Encuentro</h2>
          <div className="w-10 text-right">
            <span className="text-[10px] font-bold text-gray-500">V1</span>
          </div>
        </div>
      </header>

      {/* Contenido principal con scroll */}
      <main className="flex-1 px-6 overflow-y-auto pb-48 no-scrollbar">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 mt-4">
          {/* Nombre del Encuentro */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#47f425] uppercase tracking-widest ml-1">Nombre del Encuentro</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#161d16] border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-[#47f425] outline-none transition-all focus:ring-2 focus:ring-[#47f425]/20"
              placeholder="Ej: JDM Night Meet"
              type="text"
              required
            />
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#47f425] uppercase tracking-widest ml-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MeetCategory)}
              className="w-full bg-[#161d16] border border-white/10 rounded-2xl p-4 text-white focus:border-[#47f425] outline-none transition-all appearance-none focus:ring-2 focus:ring-[#47f425]/20"
              style={{
                backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuC9FMZ9Dyp6mgoKfUiwNkKRUwlc3WMhqt2IreQFpx9nvHgMBvHZhPVZT3czpIIOGdnSiselw_FT0L7kcntLfAR6cTyvk2kokf36YePF_pIYhYCzUvAhebWwxo2t9SOGrnJqzLjB_lplG2ojWO99KYLvyz8WblluRAZF9Srx3umyxHUJ4FhBrmfALvfKRGAc3iEX4hnHu-1G_Z29LJCM4aXTLGVzFjfVYuwGsmr3DbxKoFH3pryTNZsQGsJ-4tVY9mOmH5HNpnsKJgYQ)`,
                backgroundPosition: 'right 1rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {Object.values(MeetCategory).map((cat) => (
                <option key={cat} value={cat} className="bg-[#161d16]">{cat}</option>
              ))}
            </select>
          </div>

          {/* Descripción - NUEVA SECCIÓN */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#47f425] uppercase tracking-widest ml-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#161d16] border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-[#47f425] outline-none transition-all min-h-[120px] resize-none focus:ring-2 focus:ring-[#47f425]/20"
              placeholder="Escribe detalles adicionales sobre el encuentro..."
            ></textarea>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#47f425] uppercase tracking-widest ml-1">Hora de Inicio</label>
              <input
                value={startTimeStr}
                onChange={(e) => setStartTimeStr(e.target.value)}
                className="w-full bg-[#161d16] border border-white/10 rounded-2xl p-4 text-white focus:border-[#47f425] outline-none transition-all focus:ring-2 focus:ring-[#47f425]/20"
                type="time"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#47f425] uppercase tracking-widest ml-1">Hora de Finalización</label>
              <input
                value={endTimeStr}
                onChange={(e) => setEndTimeStr(e.target.value)}
                className="w-full bg-[#161d16] border border-white/10 rounded-2xl p-4 text-white focus:border-[#47f425] outline-none transition-all focus:ring-2 focus:ring-[#47f425]/20"
                type="time"
                required
              />
            </div>
          </div>

          {/* Capacidad */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#47f425] uppercase tracking-widest ml-1">Capacidad Máxima de Vehículos</label>
            <div className="relative">
              <input
                value={maxVehicles}
                onChange={(e) => setMaxVehicles(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full bg-[#161d16] border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-[#47f425] outline-none transition-all pr-12 focus:ring-2 focus:ring-[#47f425]/20"
                placeholder="Cantidad de autos"
                type="number"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500">directions_car</span>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-bold text-[#47f425] uppercase tracking-widest">Ubicación</label>
              <button
                type="button"
                className="flex items-center gap-1 text-[10px] font-bold text-[#47f425] uppercase tracking-tighter bg-[#47f425]/10 px-2 py-1 rounded-full border border-[#47f425]/20 active:bg-[#47f425]/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">my_location</span>
                Usar GPS Actual
              </button>
            </div>

            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/10 group">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_ShIh7dbM4MR5eYvRqi_buadHtyNLWuz5kkuYB909yhbyuaXDVFH0US_4AM4DgELqVKYz3A4kYFGbvygmTctAPukQKTpV7TD8y-jA_URkONcqJ8xmQPAwQ0zOdLBALdaxHomIRwHoFpW9aaI_T6ZWen1BdzNXF3nHZZC4oHG2U0XfMzNMCnUeN1gopOAYHbmmhZxIvgeI2tSx4lkvy2F3Es9ZuYOucr-66Nz2NJeiPraqQTmi4PAdv3SxkduJ-SlMQPPrSGpYyvI6")' }}
              >
                <div className="absolute inset-0 bg-[#0a0f0a]/30"></div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-[#47f425] text-[#0a0f0a] p-2 rounded-full shadow-[0_0_20px_rgba(71,244,37,0.6)] animate-pulse">
                  <span className="material-symbols-outlined text-xl font-bold">location_on</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 bg-[#0a0f0a]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center justify-between">
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Punto de encuentro</span>
                  <input
                    value={addressSearch}
                    onChange={(e) => setAddressSearch(e.target.value)}
                    className="bg-transparent border-none p-0 text-xs font-bold text-white focus:ring-0 w-full placeholder:text-gray-500 outline-none"
                    placeholder="Buscar dirección o lugar..."
                    type="text"
                  />
                </div>
                <button className="bg-[#47f425]/20 p-2 rounded-lg ml-2 shrink-0 active:bg-[#47f425]/40 transition-colors" type="button">
                  <span className="material-symbols-outlined text-[#47f425] text-sm">search</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Botón de Acción Fijo al final */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0f0a] via-[#0a0f0a]/95 to-transparent pt-16 pointer-events-none">
        <button
          onClick={handleFormSubmit}
          className="pointer-events-auto w-full bg-[#47f425] hover:bg-[#47f425]/90 text-[#0a0f0a] h-16 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_40px_rgba(71,244,37,0.3)] group"
        >
          <span className="text-lg font-black uppercase tracking-tighter">Publicar Encuentro</span>
          <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">rocket_launch</span>
        </button>
        <div className="h-4"></div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default CreateMeet;
