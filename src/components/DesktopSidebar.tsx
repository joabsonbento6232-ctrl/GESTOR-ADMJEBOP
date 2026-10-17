import React from 'react';
import { ChurchBranding, AppUser } from '../types/church';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Home,
  MapPin,
  Landmark,
  Calendar,
  Palette,
  Shield,
  KeyRound,
  LogOut,
  ChevronRight,
  Church,
} from 'lucide-react';

interface DesktopSidebarProps {
  branding: ChurchBranding;
  currentUser: AppUser | null;
  activeModule: string;
  onNavigate: (module: string) => void;
  onLogout: () => void;
  onOpenPasswordModal: () => void;
  membersCount: number;
  docsCount: number;
  pendingVisitsCount: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  branding,
  currentUser,
  activeModule,
  onNavigate,
  onLogout,
  onOpenPasswordModal,
  membersCount,
  docsCount,
  pendingVisitsCount,
}) => {
  const menuItems = [
    {
      id: 'painel',
      label: 'Painel Geral',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'membros',
      label: 'Rol de Membros',
      icon: Users,
      badge: membersCount > 0 ? membersCount : null,
    },
    {
      id: 'secretaria',
      label: 'Secretaria & Atas',
      icon: FolderOpen,
      badge: docsCount > 0 ? docsCount : null,
    },
    {
      id: 'familias',
      label: 'Famílias & Casais',
      icon: Home,
      badge: null,
    },
    {
      id: 'visitacao',
      label: 'Visitação Pastoral',
      icon: MapPin,
      badge: pendingVisitsCount > 0 ? `${pendingVisitsCount} pendente` : null,
      badgeAlert: pendingVisitsCount > 0,
    },
    {
      id: 'patrimonio',
      label: 'Patrimônio & Bens',
      icon: Landmark,
      badge: null,
    },
    {
      id: 'agenda',
      label: 'Agenda Ministerial',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'usuarios',
      label: 'Usuários & Senhas',
      icon: KeyRound,
      badge: 'Segurança',
    },
    {
      id: 'customizacao',
      label: 'Customização & Logo',
      icon: Palette,
      badge: null,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 lg:w-72 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] sticky top-16 shadow-sm z-30 select-none">
      {/* Congregation pill badge */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Church className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block truncate">
              {branding.congregation}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {branding.churchName}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
          Navegação Ministerial
        </span>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all group ${
                isActive
                  ? 'bg-[#00236f] text-white shadow-md shadow-blue-900/20 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-700'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1.5 shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeAlert
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile & password actions footer */}
      {currentUser && (
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/70 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-blue-800 font-semibold block truncate leading-tight mt-0.5">
                {currentUser.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onOpenPasswordModal}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              title="Alterar minha senha do aplicativo"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-700" />
              <span>Senha</span>
            </button>

            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 bg-white hover:bg-red-50 hover:text-red-700 border border-slate-200 text-slate-600 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
