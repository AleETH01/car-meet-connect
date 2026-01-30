
import React, { useState } from 'react';
import { UserRole } from '../types.ts';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'ingresar' | 'registrate'>('ingresar');

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden font-display text-white bg-[#0a0f0a]">
      {/* Background Image with Blur and Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center scale-110 blur-sm" 
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGreVl1UF2XAGQ1S0iCKQddFLPA0xjVXG4ZrY9aeF4-ejYZFtESoaaxIXXEOZ2smusLIXe1cME05moFxkz6hcrq0BryHvNiT1UOKBaUDouyhKFpWtfD-8ffeq0tAzCHK88hF5aksGPzDBAJK4TnZmnvassVlvvrAn8CC1Ws__x-Sgna4skD4UHPTLKe7QmEmldvHTzLxBQ7OXfBvCsF2_NVMBH8ZYCdlQTS2Kdh2s3rlyZiufuFVRc7reorPQC5cObnGw69ul-_dmQ")' }}
      >
        <div className="absolute inset-0 bg-blur-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full px-6 pt-10 pb-6">
        {/* Header Section - Reduced top padding */}
        <div className="mb-6 text-center shrink-0">
          <div className="inline-flex items-center justify-center size-14 bg-[#47f425]/20 rounded-2xl border border-[#47f425]/30 mb-3 shadow-[0_0_15px_rgba(71,244,37,0.2)]">
            <span className="material-symbols-outlined text-[#47f425] text-3xl">directions_car</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            CarMeet<span className="text-[#47f425] tracking-widest uppercase text-[10px] ml-1 align-middle">Connect</span>
          </h1>
          <p className="text-white/50 text-xs mt-1">Encuentra y gestiona encuentros en tiempo real</p>
        </div>

        {/* Scrollable Center Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2 flex flex-col">
          <div className="my-auto space-y-6">
            {/* Tabs */}
            <div className="flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10 shrink-0">
              <button 
                onClick={() => setActiveTab('ingresar')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all ${activeTab === 'ingresar' ? 'bg-[#47f425] text-[#0a0f0a]' : 'text-white/60 hover:text-white'}`}
              >
                Ingresar
              </button>
              <button 
                onClick={() => setActiveTab('registrate')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all ${activeTab === 'registrate' ? 'bg-[#47f425] text-[#0a0f0a]' : 'text-white/60 hover:text-white'}`}
              >
                Registrate
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              {activeTab === 'registrate' && (
                <div className="relative animate-fade-in">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">person</span>
                  <input 
                    className="w-full bg-[#161b16]/80 backdrop-blur-md border border-white/10 h-12 pl-12 pr-4 rounded-xl text-sm text-white placeholder:text-white/30 focus:ring-0 outline-none transition-all input-focus-glow border-white/10 focus:border-[#47f425]" 
                    placeholder="Nombre de Usuario" 
                    type="text"
                  />
                </div>
              )}
              
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">mail</span>
                <input 
                  className="w-full bg-[#161b16]/80 backdrop-blur-md border border-white/10 h-12 pl-12 pr-4 rounded-xl text-sm text-white placeholder:text-white/30 focus:ring-0 outline-none transition-all input-focus-glow border-white/10 focus:border-[#47f425]" 
                  placeholder="Tu Email" 
                  type="email"
                />
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">lock</span>
                <input 
                  className="w-full bg-[#161b16]/80 backdrop-blur-md border border-white/10 h-12 pl-12 pr-12 rounded-xl text-sm text-white placeholder:text-white/30 focus:ring-0 outline-none transition-all input-focus-glow border-white/10 focus:border-[#47f425]" 
                  placeholder="Tu Contraseña" 
                  type="password"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                  <span className="material-symbols-outlined text-xl">visibility</span>
                </button>
              </div>

              {activeTab === 'ingresar' && (
                <div className="flex justify-end animate-fade-in">
                  <button className="text-[10px] text-[#47f425]/80 font-medium hover:text-[#47f425] uppercase tracking-wider">Recuperar contraseña</button>
                </div>
              )}
            </div>

            {/* Social Connect & Guest Login */}
            <div className="pt-2">
              <div className="relative flex items-center justify-center mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative bg-[#0a0f0a] px-3 text-[9px] text-white/40 uppercase tracking-widest">O CONECTA CON</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#161b16]/60 border border-white/5 hover:bg-[#161b16] transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.172-1.224 1.224-3.136 2.588-6.64 2.588-5.392 0-9.496-4.384-9.496-9.776s4.104-9.776 9.496-9.776c2.936 0 5.144 1.16 6.696 2.64l2.312-2.312c-2.112-2.016-4.904-3.488-9.008-3.488-7.736 0-14.12 6.384-14.12 14.12s6.384 14.12 14.12 14.12c4.184 0 7.336-1.376 9.776-3.928 2.52-2.52 3.32-6.048 3.32-8.688 0-.544-.048-1.088-.12-1.584h-12.976z" fill="#EA4335"></path>
                    </svg>
                    <span className="text-xs font-medium">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 h-12 rounded-xl bg-black border border-white/10 hover:bg-zinc-900 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.96 1.39-1.96 2.77-3.48 2.79-1.5.03-1.98-.88-3.7-.88-1.72 0-2.25.85-3.67.91-1.46.06-2.61-1.51-3.58-2.9C.64 17.3.01 13.06 1.93 9.71c.96-1.66 2.67-2.71 4.54-2.74 1.42-.03 2.76.95 3.63.95.86 0 2.48-1.18 4.17-1.01.71.03 2.71.28 4 2.17-.11.06-2.38 1.39-2.35 4.12.03 3.29 2.87 4.45 2.91 4.46-.02.07-.46 1.58-1.53 3.12M13.68 4.44c.76-.92 1.27-2.21 1.13-3.49-1.1.04-2.43.73-3.22 1.65-.71.82-1.33 2.13-1.16 3.38 1.22.1 2.48-.61 3.25-1.54z"></path>
                    </svg>
                    <span className="text-xs font-medium">Apple</span>
                  </button>
                </div>

                {activeTab === 'ingresar' && (
                  <button 
                    onClick={() => onLogin(UserRole.GUEST)}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#0a0f0a] border border-[#47f425]/40 hover:border-[#47f425]/80 transition-all group animate-fade-in"
                  >
                    <span className="material-symbols-outlined text-[#47f425]/70 group-hover:text-[#47f425] transition-colors text-lg">person_search</span>
                    <span className="text-xs font-bold text-white/80 group-hover:text-white">Ingresar como Invitado</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button - Fixed at bottom with less top padding */}
        <div className="shrink-0 pt-4">
          <button 
            onClick={() => onLogin(UserRole.USER)}
            className="w-full h-14 bg-[#47f425] text-[#0a0f0a] rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-[#47f425]/20 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <span>{activeTab === 'ingresar' ? '¡Vamos al Encuentro!' : 'Crear Cuenta'}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
          <p className="text-center text-white/30 text-[9px] mt-4 uppercase tracking-[0.2em] leading-tight">Al continuar, aceptas nuestros términos de servicio</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default LoginView;
