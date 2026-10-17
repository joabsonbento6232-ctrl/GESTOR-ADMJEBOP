import React from 'react';
import { ChurchBranding, AppUser } from '../types/church';
import { Search, Bell, LogOut, Church, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  branding: ChurchBranding;
  currentUser: AppUser | null;
  onOpenSearch: () => void;
  onLogout: () => void;
  onNavigate: (module: string) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  branding,
  currentUser,
  onOpenSearch,
  onLogout,
  onNavigate,
  unreadCount = 2,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 bg-[#00236f] text-white shadow-md border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto h-16 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Church Info */}
        <div
          onClick={() => onNavigate('painel')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity min-w-0"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shrink-0 border border-white/20 shadow-inner overflow-hidden">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt="Logo Oficial"
                className="w-full h-full object-contain"
              />
            ) : (
              <Church className="w-6 h-6 text-blue-200" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white truncate max-w-[170px] sm:max-w-none">
                {branding.churchName}
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-800 text-blue-100 uppercase tracking-wider">
                {branding.congregation}
              </span>
            </div>
            <span className="text-[11px] text-blue-200 truncate hidden sm:block">
              {branding.churchSubtitle}
            </span>
            <span className="text-[10px] text-blue-200 truncate sm:hidden">
              {branding.congregation}
            </span>
          </div>
        </div>

        {/* Global Search Trigger Bar */}
        <div className="flex-1 max-w-md mx-1 sm:mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full h-9 sm:h-10 bg-white/10 hover:bg-white/15 text-blue-100 rounded-full px-2.5 sm:px-3.5 flex items-center justify-between gap-1.5 sm:gap-2 border border-white/15 transition-all text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 group"
            title="Buscar membro, evento ou documento da secretaria"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300 group-hover:text-white shrink-0" />
              <span className="text-blue-200/90 group-hover:text-white truncate hidden sm:inline">
                Buscar membro, documento, culto...
              </span>
              <span className="text-blue-200/90 group-hover:text-white truncate sm:hidden">
                Buscar no sistema...
              </span>
            </div>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] bg-white/10 rounded text-blue-200 border border-white/10">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Actions: Notifications & User profile */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => onNavigate('agenda')}
            className="relative p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Avisos e Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-[#00236f]" />
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-white/15">
              <div
                onClick={() => onNavigate('customizacao')}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
                title={`Logado como: ${currentUser.name} (${currentUser.role})`}
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-blue-200 leading-tight">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-blue-200 hover:text-red-300 hover:bg-white/10 rounded-full transition-colors"
                title="Sair do Sistema"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold bg-white text-[#00236f] px-3 py-1.5 rounded-full shadow hover:bg-blue-50 transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
