
import React, { useState, useEffect, useCallback } from 'react';
import MobileLayout from './components/MobileLayout.tsx';
import MapView from './components/MapView.tsx';
import MeetDetails from './components/MeetDetails.tsx';
import CreateMeet from './components/CreateMeet.tsx';
import LoginView from './components/LoginView.tsx';
import { User, Meet, UserRole, MeetCategory, Crew } from './types.ts';
import { filterMeetsByRole, isProximityAllowed, canUserCreateMeet } from './services/businessRules.ts';

// --- MOCK DATA ---
const MOCK_MEETS: Meet[] = [
  {
    id: '1',
    name: 'JDM Night Meet',
    category: MeetCategory.DEPORTIVOS,
    startTime: Date.now(),
    endTime: Date.now() + 3600000 * 4,
    latitude: -34.6037,
    longitude: -58.3816,
    maxVehicles: 30,
    currentVehicles: 12,
    description: 'Encuentro exclusivo para amantes de los deportivos japoneses. Trae tu 90s spirit.',
    isPrivate: false,
    creatorId: 'admin1'
  },
  {
    id: '2',
    name: 'Clásicos del Domingo',
    category: MeetCategory.CLASICOS,
    startTime: Date.now(),
    endTime: Date.now() + 3600000 * 6,
    latitude: -34.5885,
    longitude: -58.4106,
    maxVehicles: 50,
    currentVehicles: 24,
    description: 'Exhibición de autos antiguos restaurados. Solo unidades en estado original.',
    isPrivate: false,
    creatorId: 'user1'
  }
];

const MOCK_CREWS: Crew[] = [
  { id: 'c1', name: 'Drift Kings AR', category: MeetCategory.DEPORTIVOS, memberCount: 45, adminId: 'admin1' },
  { id: 'c2', name: 'V8 Muscle Club', category: MeetCategory.CLASICOS, memberCount: 12, adminId: 'admin2' }
];

const App: React.FC = () => {
  const [view, setView] = useState<'splash' | 'login' | 'map' | 'crews' | 'profile'>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [meets, setMeets] = useState<Meet[]>(MOCK_MEETS);
  const [crews] = useState<Crew[]>(MOCK_CREWS);
  const [selectedMeet, setSelectedMeet] = useState<Meet | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([-34.6037, -58.3816]);

  // Navigation State
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationDestination, setNavigationDestination] = useState<[number, number] | null>(null);

  // Splash Screen timer matching the visual flow
  useEffect(() => {
    const timer = setTimeout(() => {
      setView('login');
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Geolocation effect
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn('Usando ubicación por defecto')
      );
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    const newUser: User = {
      id: role === UserRole.ADMIN ? 'admin1' : (role === UserRole.USER ? 'user1' : 'guest1'),
      name: role.charAt(0) + role.slice(1).toLowerCase(),
      role: role,
      crewIds: role === UserRole.USER ? ['c1'] : [],
      lastCreatedMeetAt: undefined
    };
    setUser(newUser);
    setView('map');
  };

  const handleCreateMeet = (meetData: Partial<Meet>) => {
    if (!user) return;

    const { allowed, reason } = canUserCreateMeet(user, meets);
    if (!allowed) {
      alert(reason);
      return;
    }

    if (!isProximityAllowed(meetData.latitude!, meetData.longitude!, meets)) {
      alert('Ya existe un encuentro en un radio de 2km. Elige otro lugar.');
      return;
    }

    const newMeet: Meet = {
      ...meetData as Meet,
      id: Math.random().toString(36).substr(2, 9),
    };

    setMeets(prev => [...prev, newMeet]);
    setUser(prev => prev ? { ...prev, lastCreatedMeetAt: Date.now() } : null);
    setIsCreating(false);
    alert('¡Encuentro publicado con éxito!');
  };

  const handleStartNavigation = () => {
    if (selectedMeet) {
      setNavigationDestination([selectedMeet.latitude, selectedMeet.longitude]);
      setIsNavigating(true);
      setSelectedMeet(null); // Close details when starting navigation
    }
  };

  const filteredMeets = filterMeetsByRole(meets, user);

  if (view === 'splash') {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
        {/* Main Branding */}
        <div className="z-10 text-center">
          <h1 className="text-5xl font-bold italic tracking-tighter">
            <span className="text-white">CarMeet</span>
            <span className="text-[#47f425]">Connect</span>
          </h1>
        </div>

        {/* Center Glow Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs h-1 bg-[#47f425]/20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-[2px] bg-[#47f425]/40 blur-sm"></div>

        {/* Bottom Loading Area */}
        <div className="absolute bottom-20 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-zinc-900 border-t-[#47f425] rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(71,244,37,0.3)]"></div>
          <p className="text-zinc-500 text-[10px] tracking-[0.3em] font-medium uppercase animate-pulse">
            Initializing Engines
          </p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <MobileLayout activeView={view} onViewChange={setView} userRole={user?.role}>
      {view === 'map' && (
        <>
          <div className="absolute top-0 inset-x-0 z-[1001] p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-900/90 border border-zinc-700/50 rounded-full h-12 flex items-center px-4 backdrop-blur-md">
                <svg className="text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                  type="text"
                  placeholder="Buscar encuentros..."
                  className="bg-transparent border-none outline-none text-sm ml-2 text-white w-full"
                />
              </div>
              <button className="w-12 h-12 bg-zinc-900/90 border border-zinc-700/50 rounded-full flex items-center justify-center backdrop-blur-md">
                <svg className="text-[#47f425]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M7 12h10" /><path d="M10 18h4" /></svg>
              </button>
            </div>
          </div>

          <MapView
            meets={filteredMeets}
            center={userLocation}
            onMarkerClick={setSelectedMeet}
            isNavigating={isNavigating}
            destination={navigationDestination}
            onExitNavigation={() => setIsNavigating(false)}
          />

          {user?.role !== UserRole.GUEST && !isNavigating && (
            <button
              onClick={() => setIsCreating(true)}
              className="absolute right-6 bottom-6 z-[999] w-16 h-16 bg-[#47f425] text-black rounded-full flex items-center justify-center shadow-2xl shadow-[#47f425]/40 border-4 border-black active:scale-90 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
            </button>
          )}

          {selectedMeet && (
            <MeetDetails
              meet={selectedMeet}
              onClose={() => setSelectedMeet(null)}
              onNavigate={handleStartNavigation}
            />
          )}

          {isCreating && (
            <CreateMeet
              user={user!}
              currentLatLng={userLocation}
              onCancel={() => setIsCreating(false)}
              onSubmit={handleCreateMeet}
            />
          )}
        </>
      )}

      {view === 'crews' && (
        <div className="p-6 h-full overflow-y-auto animate-fade-in bg-[#0a0a0a] font-display">
          <h2 className="text-3xl font-bold text-white mb-2">CREWS</h2>
          <p className="text-zinc-500 text-sm mb-8">Grupos exclusivos y eventos privados.</p>

          <div className="space-y-4">
            {crews.map((crew) => (
              <div key={crew.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl border border-zinc-700 shadow-[inset_0_0_10px_rgba(71,244,37,0.05)]">
                  {crew.category === MeetCategory.DEPORTIVOS ? '🏎️' : '🏛️'}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg">{crew.name}</h4>
                  <p className="text-xs text-zinc-500">{crew.memberCount} Miembros • {crew.category}</p>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${user?.crewIds.includes(crew.id) ? 'bg-zinc-800 text-zinc-400' : 'bg-[#47f425] text-black'}`}
                  disabled={user?.role === UserRole.GUEST || user?.crewIds.includes(crew.id)}
                >
                  {user?.crewIds.includes(crew.id) ? 'MIEMBRO' : 'UNIRSE'}
                </button>
              </div>
            ))}
          </div>

          {user?.role === UserRole.ADMIN && (
            <button className="mt-8 w-full border-2 border-dashed border-zinc-700 py-4 rounded-2xl text-zinc-500 font-bold hover:border-[#47f425] hover:text-[#47f425] transition-colors">
              + CREAR NUEVA CREW
            </button>
          )}
        </div>
      )}

      {view === 'profile' && (
        <div className="p-6 h-full flex flex-col animate-fade-in bg-[#0a0a0a] font-display">
          <div className="flex flex-col items-center mt-8 mb-12">
            <div className="w-24 h-24 bg-gradient-to-tr from-[#47f425] to-[#ff0055] rounded-full p-1 mb-4 shadow-[0_0_20px_rgba(71,244,37,0.2)]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-3xl">
                {user?.role === UserRole.ADMIN ? '👑' : '🏎️'}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white uppercase">{user?.name || 'Corredor'}</h3>
            <span className="text-xs text-zinc-500 tracking-widest mt-1 uppercase">{user?.role}</span>
          </div>

          <div className="flex-1 space-y-3">
            <button className="w-full bg-zinc-900 py-4 px-6 rounded-2xl flex justify-between items-center text-zinc-300 border border-transparent hover:border-zinc-700 transition-all">
              <span>Configuración de Cuenta</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
            <button className="w-full bg-zinc-900 py-4 px-6 rounded-2xl flex justify-between items-center text-zinc-300 border border-transparent hover:border-zinc-700 transition-all">
              <span>Mis Encuentros</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          <button
            onClick={() => setView('login')}
            className="mt-auto w-full py-4 text-[#ff0055] font-bold border border-[#ff0055]/30 rounded-2xl hover:bg-[#ff0055]/10"
          >
            CERRAR SESIÓN
          </button>
        </div>
      )}
    </MobileLayout>
  );
};

export default App;
