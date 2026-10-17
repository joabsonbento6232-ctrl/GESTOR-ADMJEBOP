import React, { useState } from 'react';
import { ChurchFamily, Member } from '../types/church';
import { getWhatsAppLink } from '../services/storage';
import { Home, Users, Phone, MapPin, Plus, Search, ChevronRight, X } from 'lucide-react';

interface FamiliesModuleProps {
  families: ChurchFamily[];
  members: Member[];
  onSaveFamily: (family: ChurchFamily) => void;
  onSelectMember: (member: Member) => void;
}

export const FamiliesModule: React.FC<FamiliesModuleProps> = ({
  families,
  members,
  onSaveFamily,
  onSelectMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newHeadName, setNewHeadName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('Centro');
  const [newPhone, setNewPhone] = useState('(83) 9');

  const filtered = families.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName.trim()) return;

    const newFam: ChurchFamily = {
      id: 'fam-' + Date.now(),
      name: newFamilyName.trim(),
      headName: newHeadName.trim() || 'Responsável Familiar',
      address: newAddress.trim() || 'Remígio - PB',
      neighborhood: newNeighborhood.trim(),
      phone: newPhone.trim() || '(83) 98765-4321',
      membersCount: 2,
      memberNames: [newHeadName.trim() || 'Membro Titular'],
    };

    onSaveFamily(newFam);
    setIsModalOpen(false);
    setNewFamilyName('');
    setNewHeadName('');
    setNewAddress('');
  };

  return (
    <div className="flex flex-col w-full pb-10 px-3 sm:px-6 max-w-6xl mx-auto gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Home className="w-6 h-6 text-emerald-600" /> Núcleos Familiares da Igreja
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento de lares, casais e membros agregados em Remígio-PB
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Nova Família
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por sobrenome de família, responsável ou rua..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Families List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((fam) => (
          <div
            key={fam.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {fam.membersCount} integrantes
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 mt-3 truncate">{fam.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Representante: <strong className="text-slate-700">{fam.headName}</strong>
              </p>

              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{fam.address}, {fam.neighborhood}</span>
              </div>

              {/* Members Chips */}
              <div className="mt-3 flex flex-wrap gap-1">
                {fam.memberNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={getWhatsAppLink(
                  fam.phone,
                  `A Paz do Senhor Jesus, amada ${fam.name}! Contato pastoral da ADMJEBOP Remígio-PB.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{fam.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="font-bold text-sm text-slate-800">Cadastrar Nova Família</span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFamily} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Família *</label>
                <input
                  type="text"
                  required
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  placeholder="ex: Família Silva, Família Santos..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chefe da Família / Responsável</label>
                <input
                  type="text"
                  value={newHeadName}
                  onChange={(e) => setNewHeadName(e.target.value)}
                  placeholder="Nome do membro responsável"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={newNeighborhood}
                    onChange={(e) => setNewNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Rua, número"
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md"
                >
                  Salvar Família
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
