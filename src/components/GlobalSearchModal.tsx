import React, { useState, useEffect, useRef } from 'react';
import { Member, ChurchEvent, SecretaryAttachment } from '../types/church';
import { getWhatsAppLink } from '../services/storage';
import {
  Search,
  X,
  User,
  Calendar,
  FileText,
  Phone,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Tag,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  events: ChurchEvent[];
  documents: SecretaryAttachment[];
  onSelectMember: (member: Member) => void;
  onSelectDocument: (doc: SecretaryAttachment) => void;
  onSelectEvent: (event: ChurchEvent) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  members,
  events,
  documents,
  onSelectMember,
  onSelectDocument,
  onSelectEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'todos' | 'membros' | 'documentos' | 'eventos'>('todos');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalized = searchTerm.toLowerCase().trim();

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(normalized) ||
      m.role.toLowerCase().includes(normalized) ||
      m.phone.toLowerCase().includes(normalized) ||
      m.neighborhood.toLowerCase().includes(normalized)
  );

  const filteredDocuments = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(normalized) ||
      d.category.toLowerCase().includes(normalized) ||
      d.fileName.toLowerCase().includes(normalized) ||
      d.author.toLowerCase().includes(normalized)
  );

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(normalized) ||
      e.category.toLowerCase().includes(normalized) ||
      e.location.toLowerCase().includes(normalized) ||
      e.responsible.toLowerCase().includes(normalized)
  );

  const totalResults =
    (activeTab === 'todos' || activeTab === 'membros' ? filteredMembers.length : 0) +
    (activeTab === 'todos' || activeTab === 'documentos' ? filteredDocuments.length : 0) +
    (activeTab === 'todos' || activeTab === 'eventos' ? filteredEvents.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[82vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por membro, documento da secretaria, atas, evento..."
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-200/60 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs bg-white">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'todos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({filteredMembers.length + filteredDocuments.length + filteredEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('membros')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'membros'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Membros ({filteredMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'documentos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Secretaria & Atas ({filteredDocuments.length})
          </button>
          <button
            onClick={() => setActiveTab('eventos')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'eventos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Agenda & Cultos ({filteredEvents.length})
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 divide-y divide-slate-100">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
              <p className="text-sm font-medium text-slate-600">Nenhum resultado encontrado</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Tente buscar por nome de membro, função ministerial, documento ou ata.
              </p>
            </div>
          ) : null}

          {/* Members Results */}
          {(activeTab === 'todos' || activeTab === 'membros') && filteredMembers.length > 0 && (
            <div className="space-y-1.5 pt-2 first:pt-0">
              <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Membros da Congregação ({filteredMembers.length})
              </div>
              <div className="space-y-1">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div
                      onClick={() => {
                        onSelectMember(member);
                        onClose();
                      }}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    >
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800 truncate">
                            {member.name}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 truncate">
                            {member.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {member.neighborhood} • {member.address}
                        </p>
                      </div>
                    </div>

                    {/* WhatsApp Direct Action requested in prompt! */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={getWhatsAppLink(
                          member.phone,
                          `A Paz do Senhor Jesus, irmão(ã) ${member.name}! Aqui é da ADMJEBOP Remígio-PB.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
                        title={`Conversar com ${member.name} no WhatsApp`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                        <span className="sm:hidden">{member.phone.slice(-4)}</span>
                      </a>
                      <button
                        onClick={() => {
                          onSelectMember(member);
                          onClose();
                        }}
                        className="p-1.5 text-slate-400 group-hover:text-blue-600 rounded-lg hover:bg-blue-100/50"
                        title="Ver Ficha do Membro"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Secretary Documents Results */}
          {(activeTab === 'todos' || activeTab === 'documentos') && filteredDocuments.length > 0 && (
            <div className="space-y-1.5 pt-3">
              <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                Documentos e Anexos da Secretaria ({filteredDocuments.length})
              </div>
              <div className="space-y-1">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onSelectDocument(doc);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-100 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-slate-800 truncate block">
                          {doc.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[11px]">
                            {doc.category}
                          </span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Abrir Anexo <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Results */}
          {(activeTab === 'todos' || activeTab === 'eventos') && filteredEvents.length > 0 && (
            <div className="space-y-1.5 pt-3">
              <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Eventos e Cultos da Agenda ({filteredEvents.length})
              </div>
              <div className="space-y-1">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      onSelectEvent(evt);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-100 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-slate-800 truncate block">
                          {evt.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-indigo-700">
                            {evt.date} às {evt.time}
                          </span>
                          <span>•</span>
                          <span>{evt.location}</span>
                          <span>•</span>
                          <span className="truncate">{evt.responsible}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Dica: Clique no botão WhatsApp do membro para abrir a conversa instantaneamente.</span>
          <span className="font-semibold text-blue-700">ADMJEBOP Remígio</span>
        </div>
      </div>
    </div>
  );
};
