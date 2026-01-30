
import React from 'react';
import { UserRole } from '../types';

interface MobileLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: any) => void;
  userRole: UserRole | undefined;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, activeView, onViewChange, userRole }) => {
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-black overflow-hidden relative shadow-2xl border-x border-zinc-800">
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
      
      {/* Bottom Navigation Bar */}
      {activeView !== 'splash' && activeView !== 'login' && (
        <nav className="h-16 bg-[#0a0a0a] border-t border-zinc-800 flex items-center justify-around px-4 pb-1">
          <button 
            onClick={() => onViewChange('map')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'map' ? 'text-[#1aff00]' : 'text-zinc-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83a1 1 0 0 1 1.447.894v12.766a2 2 0 0 1-1.106 1.789l-6 3a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 2 21.012V8.246a2 2 0 0 1 1.106-1.789l6-3a2 2 0 0 1 1.788 0l4.212 2.106z"/><path d="M9 3.5v13"/><path d="M15 7.5v13"/></svg>
            <span className="text-[10px] font-medium">Mapa</span>
          </button>

          <button 
            onClick={() => onViewChange('crews')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'crews' ? 'text-[#1aff00]' : 'text-zinc-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="text-[10px] font-medium">Crews</span>
          </button>

          <button 
            onClick={() => onViewChange('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'profile' ? 'text-[#1aff00]' : 'text-zinc-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default MobileLayout;
