import React, { useState } from 'react';
import { PastoralVisit } from '../types/church';
import { getWhatsAppLink } from '../services/storage';
import {
  MapPin,
  Plus,
  Phone,
  PhoneCall,
  CheckCircle,
  Clock,
  AlertTriangle,
  Heart,
  X,
  ExternalLink,
} from 'lucide-react';

interface VisitationModuleProps {
  visits: PastoralVisit[];
  onSaveVisit: (visit: PastoralVisit) => void;
  onUpdateStatus: (id: string, status: PastoralVisit['status']) => void;
}

export const VisitationModule: React.FC<VisitationModuleProps> = ({
  visits,
  onSaveVisit,
  onUpdateStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [phone, setPhone] = useState('(83) 9');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Bela Vista');
  const [urgency, setUrgency] = useState<PastoralVisit['urgency']>('Urgente');
  const [reason, setReason] = useState<PastoralVisit['reason']>('Saúde');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    const newVisit: PastoralVisit = {
      id: 'vis-' + Date.now(),
      memberName: memberName.trim(),
      phone: phone.trim() || '(83) 98765-4321',
      address: address.trim() || 'Remígio - PB',
      neighborhood: neighborhood.trim(),
      urgency,
      reason,
      status: 'Pendente',
      scheduledDate: new Date().toISOString().split('T')[0] + ' 16:30',
      notes: notes.trim(),
    };

    onSaveVisit(newVisit);
    setIsModalOpen(false);
    setMemberName('');
    setNotes('');
  };

  return (
    <div className="flex flex-col w-full pb-10 px-3 sm:px-6 max-w-6xl mx-auto gap-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal-600" /> Visitação Pastoral & Assistência
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento de enfermos, lares, novos convertidos e oração pastoral
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-teal-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Solicitar / Agendar Visita
        </button>
      </div>

      {/* Visits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {visits.map((vis) => (
          <div
            key={vis.id}
            className={`rounded-2xl p-4 border shadow-sm transition-all flex flex-col justify-between bg-white ${
              vis.urgency === 'Urgente'
                ? 'border-red-200 ring-1 ring-red-100'
                : 'border-slate-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    vis.urgency === 'Urgente'
                      ? 'bg-red-100 text-red-700'
                      : vis.urgency === 'Alta'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {vis.urgency} • {vis.reason}
                </span>

                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    vis.status === 'Realizada'
                      ? 'bg-emerald-100 text-emerald-800'
                      : vis.status === 'Confirmada'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {vis.status}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 mt-2">{vis.memberName}</h3>

              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {vis.address}, {vis.neighborhood}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Data Prevista: {vis.scheduledDate}</span>
                </div>
              </div>

              {vis.notes && (
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl">
                  {vis.notes}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {/* 1-Click WhatsApp to confirm visit! */}
                <a
                  href={getWhatsAppLink(
                    vis.phone,
                    `A Paz do Senhor Jesus, irmão(ã) ${vis.memberName}! A equipe pastoral da ADMJEBOP Remígio entrará em contato para sua visita pastoral e momento de oração.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp
                </a>

                {/* Status toggle */}
                <div className="flex items-center gap-1">
                  {vis.status !== 'Realizada' ? (
                    <button
                      onClick={() => onUpdateStatus(vis.id, 'Realizada')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700"
                    >
                      Concluir
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(vis.id, 'Pendente')}
                      className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                    >
                      Reabrir
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="font-bold text-sm text-slate-800">Solicitar Visita Pastoral</span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Irmão(ã) *</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Nome do membro ou visitante"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número ou ponto de referência"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Motivo</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="Saúde">Saúde / Enfermidade</option>
                    <option value="Espiritual">Espiritual / Oração</option>
                    <option value="Acolhimento">Acolhimento no Lar</option>
                    <option value="Casal">Casal / Família</option>
                    <option value="Novo Convertido">Novo Convertido</option>
                    <option value="Outro">Outro Motivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Urgência</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="Urgente">Urgente</option>
                    <option value="Alta">Alta</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observações do Pedido</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalhes para os pastores ou obreiros..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs sm:text-sm font-bold shadow-md"
                >
                  Salvar Pedido de Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
