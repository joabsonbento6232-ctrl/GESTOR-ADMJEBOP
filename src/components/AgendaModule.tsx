import React, { useState } from 'react';
import { ChurchEvent } from '../types/church';
import { Calendar, Plus, Clock, MapPin, User, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface AgendaModuleProps {
  events: ChurchEvent[];
  onSaveEvent: (event: ChurchEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const AgendaModule: React.FC<AgendaModuleProps> = ({
  events,
  onSaveEvent,
  onDeleteEvent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evtToDelete, setEvtToDelete] = useState<ChurchEvent | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChurchEvent['category']>('Culto de Doutrina');
  const [date, setDate] = useState('2026-10-20');
  const [time, setTime] = useState('19:30');
  const [location, setLocation] = useState('Templo Sede');
  const [responsible, setResponsible] = useState('Pr. Presidente');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvt: ChurchEvent = {
      id: 'evt-' + Date.now(),
      title: title.trim(),
      category,
      date,
      time,
      location: location.trim(),
      responsible: responsible.trim(),
      description: description.trim(),
    };

    onSaveEvent(newEvt);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="flex flex-col w-full pb-10 px-3 sm:px-6 max-w-6xl mx-auto gap-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-600" /> Agenda Anual Ministerial
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cultos de doutrina, círculo de oração, cultos de jovens e reuniões de obreiros
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Novo Evento / Culto
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full">
                  {evt.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {evt.date} às {evt.time}h
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 mt-2">{evt.title}</h3>

              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dirigente / Pregador: {evt.responsible}</span>
                </div>
              </div>

              {evt.description && (
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl">
                  {evt.description}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-700">Confirmado no Rol</span>
              <button
                type="button"
                onClick={() => setEvtToDelete(evt)}
                className="text-xs text-red-500 hover:text-red-700 font-semibold p-1 hover:bg-red-50 rounded-lg"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="font-bold text-sm text-slate-800">Agendar Culto ou Evento</span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Evento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Culto com a Juventude Apocalipse"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                >
                  <option value="Culto de Doutrina">Culto de Doutrina</option>
                  <option value="Culto Público">Culto Público / Evangelístico</option>
                  <option value="Círculo de Oração">Círculo de Oração Vaso de Unção</option>
                  <option value="Juventude">Juventude Apocalipse</option>
                  <option value="Varões">Varões Gideão</option>
                  <option value="Missões">Culto de Missões</option>
                  <option value="Reunião de Obreiros">Reunião de Obreiros</option>
                  <option value="EBD">Escola Bíblica Dominical (EBD)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Horário</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Local</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Responsável / Dirigente</label>
                <input
                  type="text"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
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
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-xs sm:text-sm font-bold shadow-md"
                >
                  Salvar na Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP CONFIRMATION MODAL FOR EVENT DELETION */}
      {evtToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col text-center">
            <h3 className="text-lg font-black text-slate-900">
              Confirmar Exclusão de Evento
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Deseja realmente excluir o evento{' '}
              <strong className="text-slate-900">"{evtToDelete.title}"</strong> da agenda ministerial?
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setEvtToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEvent(evtToDelete.id);
                  setEvtToDelete(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

