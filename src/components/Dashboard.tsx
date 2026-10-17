import React, { useState } from 'react';
import {
  ChurchBranding,
  Member,
  PastoralVisit,
  ChurchAsset,
  ChurchEvent,
  ChurchFamily,
} from '../types/church';
import { getWhatsAppLink } from '../services/storage';
import {
  Users,
  Home,
  FolderOpen,
  Globe2,
  HeartHandshake,
  MapPin,
  Landmark,
  Cake,
  Calendar,
  Palette,
  RefreshCw,
  Send,
  PhoneCall,
  CalendarDays,
  Sparkles,
  Camera,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';

interface DashboardProps {
  branding: ChurchBranding;
  members: Member[];
  families: ChurchFamily[];
  visits: PastoralVisit[];
  assets: ChurchAsset[];
  events: ChurchEvent[];
  onNavigate: (module: string) => void;
  onSelectMember: (member: Member) => void;
  onUpdateBranding: (updated: ChurchBranding) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  branding,
  members,
  families,
  visits,
  assets,
  events,
  onNavigate,
  onSelectMember,
  onUpdateBranding,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(false);

  // Calculate totals
  const totalAssetsValue = assets.reduce((acc, curr) => acc + curr.value * curr.quantity, 0);
  const activeMembersCount = members.filter((m) => m.status === 'Ativo').length;
  const pendingVisitsCount = visits.filter((v) => v.status === 'Pendente').length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSyncFeedback(true);
      setTimeout(() => setSyncFeedback(false), 2500);
    }, 700);
  };

  // Upload new facade banner directly from dashboard if desired
  const handleFacadeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onUpdateBranding({
          ...branding,
          facadeBannerUrl: base64,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col w-full pb-8 px-3 sm:px-6 max-w-6xl mx-auto gap-4">
      {/* Pastoral Warm Welcome Banner (Matches mobile view) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00236f] via-[#1e3a8a] to-[#00246b] text-white p-5 sm:p-6 shadow-lg border border-blue-800/40">
        <div className="absolute -right-8 -bottom-10 opacity-10 text-white pointer-events-none">
          <Landmark className="w-48 h-48" />
        </div>

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Remígio - PB • Sede
            </span>

            <div className="flex items-center gap-2">
              {syncFeedback && (
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle className="w-3.5 h-3.5" /> Atualizado!
                </span>
              )}
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all"
                title="Sincronizar métricas do campo"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="mt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {branding.bannerTitle || 'A Paz do Senhor Jesus!'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5">
              {branding.bannerSubtitle || 'Gestão Ministerial Integrada - Remígio-PB'}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="text-blue-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-300" />
              Hoje: Culto de Doutrina às 19h30
            </span>
            <span className="text-emerald-300 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Campo Ativo • {activeMembersCount} Membros
            </span>
          </div>
        </div>
      </section>

      {/* Metric Overview Bento Cards */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00236f]" />
            <h2 className="text-base font-bold text-slate-800">Visão Ministerial Geral</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Atualizado em tempo real</span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Membros */}
          <div
            onClick={() => onNavigate('membros')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                +3 mês
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeMembersCount}
              </div>
              <span className="text-xs text-slate-500 font-medium">Membros Ativos</span>
            </div>
          </div>

          {/* Famílias */}
          <div
            onClick={() => onNavigate('familias')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Núcleos
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {families.length || 52}
              </div>
              <span className="text-xs text-slate-500 font-medium">Famílias Integradas</span>
            </div>
          </div>

          {/* Visitas Pastorais */}
          <div
            onClick={() => onNavigate('visitacao')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                Urgente
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {pendingVisitsCount}
              </div>
              <span className="text-xs text-slate-500 font-medium">Visitas Pendentes</span>
            </div>
          </div>

          {/* Aniversariantes do Mês */}
          <div
            onClick={() => onNavigate('membros')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Cake className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Neste mês
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">12</div>
              <span className="text-xs text-slate-500 font-medium">Aniversariantes</span>
            </div>
          </div>
        </div>

        {/* Patrimônio Full Width Card */}
        <div
          onClick={() => onNavigate('patrimonio')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#00236f] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Patrimônio Inventariado</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  totalAssetsValue
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> Auditado
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {assets.length} bens cadastrados
            </span>
          </div>
        </div>
      </section>

      {/* Categorical Quick Access Menu (Matching 10 colored tiles) */}
      <section className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-800">Módulos de Gestão</h2>
          <span className="text-xs text-slate-500">Acesso Rápido</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* 1. Membros */}
          <button
            onClick={() => onNavigate('membros')}
            className="p-3 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-blue-600/20">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Membros</div>
              <span className="text-[11px] text-slate-500 truncate block">Rol & Registros</span>
            </div>
          </button>

          {/* 2. Famílias */}
          <button
            onClick={() => onNavigate('familias')}
            className="p-3 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-emerald-600/20">
              <Home className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Famílias</div>
              <span className="text-[11px] text-slate-500 truncate block">Lares & Casais</span>
            </div>
          </button>

          {/* 3. Secretaria */}
          <button
            onClick={() => onNavigate('secretaria')}
            className="p-3 bg-white hover:bg-slate-100/60 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-slate-700/20">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Secretaria</div>
              <span className="text-[11px] text-slate-500 truncate block">Atas & Anexos</span>
            </div>
          </button>

          {/* 4. Missões */}
          <button
            onClick={() => onNavigate('secretaria')}
            className="p-3 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-purple-600/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Missões</div>
              <span className="text-[11px] text-slate-500 truncate block">Campos & Apoio</span>
            </div>
          </button>

          {/* 5. Ação Social */}
          <button
            onClick={() => onNavigate('membros')}
            className="p-3 bg-white hover:bg-rose-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-rose-600/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Ação Social</div>
              <span className="text-[11px] text-slate-500 truncate block">Cestas & Apoio</span>
            </div>
          </button>

          {/* 6. Visitação */}
          <button
            onClick={() => onNavigate('visitacao')}
            className="p-3 bg-white hover:bg-teal-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-teal-600/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Visitação</div>
              <span className="text-[11px] text-slate-500 truncate block">Pastoral Campo</span>
            </div>
          </button>

          {/* 7. Patrimônio */}
          <button
            onClick={() => onNavigate('patrimonio')}
            className="p-3 bg-white hover:bg-amber-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-amber-600/20">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Patrimônio</div>
              <span className="text-[11px] text-slate-500 truncate block">Bens & Finanças</span>
            </div>
          </button>

          {/* 8. Aniversários */}
          <button
            onClick={() => onNavigate('membros')}
            className="p-3 bg-white hover:bg-orange-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-orange-600/20">
              <Cake className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Aniversários</div>
              <span className="text-[11px] text-slate-500 truncate block">Felicitações</span>
            </div>
          </button>

          {/* 9. Agenda Anual */}
          <button
            onClick={() => onNavigate('agenda')}
            className="p-3 bg-white hover:bg-cyan-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-cyan-600/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Agenda Anual</div>
              <span className="text-[11px] text-slate-500 truncate block">Cultos & Eventos</span>
            </div>
          </button>

          {/* 10. Cores e Personalização */}
          {/* 10. Cores e Personalização */}
          <button
            onClick={() => onNavigate('customizacao')}
            className="p-3 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-indigo-600/20">
              <Palette className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Customização</div>
              <span className="text-[11px] text-slate-500 truncate block">Logo & Temas</span>
            </div>
          </button>

          {/* 11. Usuários e Senhas do App */}
          <button
            onClick={() => onNavigate('usuarios')}
            className="p-3 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-center gap-3 text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-purple-700/20">
              <Palette className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-slate-800 truncate">Usuários & Senhas</div>
              <span className="text-[11px] text-slate-500 truncate block">Acessos do App</span>
            </div>
          </button>
        </div>
      </section>

      {/* Aniversariantes da Semana with direct WhatsApp */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Aniversariantes da Semana
            </h3>
          </div>
          <button
            onClick={() => onNavigate('membros')}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Ver todos (12)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Item 1: Maria José */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
            <div
              onClick={() => {
                const mem = members.find((m) => m.id === 'mem-3');
                if (mem) onSelectMember(mem);
              }}
              className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
            >
              <img
                src={
                  members.find((m) => m.id === 'mem-3')?.photo ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
                }
                alt="Diaconisa Maria José"
                className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-amber-200"
              />
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm text-slate-800 truncate block">
                  Diaconisa Maria José
                </span>
                <span className="text-[11px] text-amber-700 font-medium">
                  Amanhã • 17 de Outubro
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Dirigente Vaso de Unção
                </span>
              </div>
            </div>

            <a
              href={getWhatsAppLink(
                '(83) 98765-1234',
                'A Paz do Senhor Jesus, Diaconisa Maria José! Parabéns pelo seu aniversário! Que o Senhor derrame ricas bênçãos sobre sua vida e ministério. Felicitações da Igreja ADMJEBOP Remígio!'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
              title="Parabenizar no WhatsApp"
            >
              <Send className="w-4 h-4" />
            </a>
          </div>

          {/* Item 2: Marcos Vinicius */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
            <div
              onClick={() => {
                const mem = members.find((m) => m.id === 'mem-6');
                if (mem) onSelectMember(mem);
              }}
              className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
            >
              <img
                src={
                  members.find((m) => m.id === 'mem-6')?.photo ||
                  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
                }
                alt="Ev. Marcos Vinícius"
                className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-amber-200"
              />
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm text-slate-800 truncate block">
                  Ev. Marcos Vinícius
                </span>
                <span className="text-[11px] text-amber-700 font-medium">
                  Sexta • 19 de Outubro
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Dirigente ministério de louvor
                </span>
              </div>
            </div>

            <a
              href={getWhatsAppLink(
                '(83) 99123-4567',
                'A Paz do Senhor Jesus, Ev. Marcos Vinícius! Feliz aniversário! Que Deus continue usando fortemente seu dom e louvor para glória Dele. Felicitações da ADMJEBOP Remígio!'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
              title="Parabenizar no WhatsApp"
            >
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Alertas Rápidos e Agenda Ministerial */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-700" />
            <h2 className="text-base font-bold text-slate-800">Alertas & Agenda Rápida</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">3 avisos importantes</span>
        </div>

        <div className="space-y-2.5">
          {/* Alerta 1 */}
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center shrink-0 border border-blue-100">
              <span className="text-[10px] font-bold uppercase leading-none">Qui</span>
              <span className="text-base font-extrabold leading-tight">16</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-800">Culto de Doutrina Bíblica</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">
                  Templo Sede
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Estudo sistemático no livro de Efésios com Pr. Presidente. Início às 19:30h.
              </p>
            </div>
          </div>

          {/* Alerta 2 */}
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex flex-col items-center justify-center shrink-0 border border-purple-100">
              <span className="text-[10px] font-bold uppercase leading-none">Sáb</span>
              <span className="text-base font-extrabold leading-tight">18</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-800">
                  Reunião Mensal de Obreiros
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-semibold">
                  Obrigatório
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Alinhamento trimestral dos dirigentes de congregações e departamentos às 14:00h.
              </p>
            </div>
          </div>

          {/* Alerta 3: Visitação Pastoral Urgente */}
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-red-100 flex items-start gap-3 bg-gradient-to-r from-red-50/40 to-white">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-800">
                  Aviso de Visitação Pastoral
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                  Saúde • Urgente
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Irmã Francisca (Bela Vista) aguarda oração e visita hoje às 16:30h.
              </p>
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <a
                  href={getWhatsAppLink(
                    '(83) 98777-1122',
                    'A Paz do Senhor, irmã Francisca! O Pastor e a equipe pastoral da ADMJEBOP estão a caminho para sua visita e oração.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Confirmar Visita
                </a>
                <button
                  onClick={() => onNavigate('visitacao')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Ver Rota / Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Church Campus Snapshot Card (Customizable Facade Image requested!) */}
      <section className="rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100 flex flex-col group relative">
        <div className="relative h-44 sm:h-56 w-full bg-slate-200 overflow-hidden">
          <img
            src={branding.facadeBannerUrl}
            alt="Fachada do Templo Sede Remígio"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent flex items-end p-4 sm:p-5">
            <div className="flex-1">
              <span className="text-[10px] sm:text-xs text-blue-200 uppercase tracking-widest font-bold">
                {branding.churchName} • {branding.congregation}
              </span>
              <p className="text-base sm:text-xl text-white font-extrabold mt-0.5">
                Unidos em Fé, Doutrina e Amor
              </p>
            </div>

            {/* Direct button to pick facade photo from gallery! */}
            <label className="cursor-pointer bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-md active:scale-95 transition-all">
              <Camera className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">Mudar Foto da Fachada</span>
              <span className="sm:hidden">Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFacadeUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-700" />
            {branding.address}
          </span>
          <span className="text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-full">
            Pastor Local: {branding.pastorPresidente}
          </span>
        </div>
      </section>
    </div>
  );
};
