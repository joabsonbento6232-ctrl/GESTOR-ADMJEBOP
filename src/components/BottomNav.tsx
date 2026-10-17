import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Menu,
  X,
  FolderOpen,
  Home,
  Landmark,
  Palette,
  KeyRound,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface BottomNavProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  onLogout?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeModule, onNavigate, onLogout }) => {
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);

  const navItems = [
    { id: 'painel', label: 'Painel', icon: LayoutDashboard },
    { id: 'membros', label: 'Membros', icon: Users },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'visitacao', label: 'Visitação', icon: MapPin },
  ];

  const handleSelectMore = (module: string) => {
    onNavigate(module);
    setIsMoreDrawerOpen(false);
  };

  const handleLogoutAction = () => {
    setIsMoreDrawerOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      onNavigate('login');
    }
  };

  return (
    <>
      {/* "Mais" Bottom Sheet Drawer (Optimized for all mobile and tablet touch viewports) */}
      {isMoreDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end p-2 sm:p-4">
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200 max-w-lg mx-auto w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-extrabold text-sm text-slate-800 block">
                  Mais Módulos Ministeriais
                </span>
                <span className="text-[11px] text-slate-400">
                  ADMJEBOP Remígio-PB • Menu de Acesso
                </span>
              </div>
              <button
                onClick={() => setIsMoreDrawerOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-4">
              <button
                onClick={() => handleSelectMore('secretaria')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate">Secretaria</span>
                  <span className="text-[10px] text-slate-400 block truncate">Atas & Anexos</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMore('familias')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate">Famílias</span>
                  <span className="text-[10px] text-slate-400 block truncate">Núcleos & Casais</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMore('patrimonio')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-100 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate">Patrimônio</span>
                  <span className="text-[10px] text-slate-400 block truncate">Bens & Finanças</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMore('usuarios')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-100 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate">Usuários</span>
                  <span className="text-[10px] text-slate-400 block truncate">Contas & Senhas</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMore('customizacao')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate">Customização</span>
                  <span className="text-[10px] text-slate-400 block truncate">Logomarca & Cores</span>
                </div>
              </button>

              {/* Botão para Sair / Bloquear Aplicativo */}
              <button
                onClick={handleLogoutAction}
                className="p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-100 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-red-900 block truncate">Sair do App</span>
                  <span className="text-[10px] text-red-600 block truncate">Tela de Entrada</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation (Mobile & Tablet < lg) */}
      <nav className="lg:hidden fixed bottom-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,35,111,0.06)] pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-14 rounded-2xl transition-all touch-manipulation ${
                  isActive
                    ? 'text-[#00236f] font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[11px] mt-0.5">{item.label}</span>
              </button>
            );
          })}

          {/* Mais Button */}
          <button
            onClick={() => setIsMoreDrawerOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 h-14 rounded-2xl transition-all touch-manipulation ${
              ['secretaria', 'familias', 'patrimonio', 'customizacao', 'usuarios'].includes(activeModule)
                ? 'text-[#00236f] font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
};
