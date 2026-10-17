import React, { useState } from 'react';
import { ChurchAsset } from '../types/church';
import { Landmark, Plus, Search, Tag, DollarSign, CheckCircle2, X } from 'lucide-react';

interface PatrimonyModuleProps {
  assets: ChurchAsset[];
  onSaveAsset: (asset: ChurchAsset) => void;
  onDeleteAsset: (id: string) => void;
}

export const PatrimonyModule: React.FC<PatrimonyModuleProps> = ({
  assets,
  onSaveAsset,
  onDeleteAsset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<ChurchAsset | null>(null);

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ChurchAsset['category']>('Eletrônicos e Som');
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(1500);
  const [location, setLocation] = useState('Templo Sede');
  const [condition, setCondition] = useState<ChurchAsset['condition']>('Excelente');

  const totalValue = assets.reduce((acc, curr) => acc + curr.value * curr.quantity, 0);

  const filtered = assets.filter((a) => {
    const matchesCat = selectedCategory === 'todos' || a.category === selectedCategory;
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAsset: ChurchAsset = {
      id: 'asset-' + Date.now(),
      name: name.trim(),
      category,
      quantity: Number(quantity) || 1,
      value: Number(value) || 0,
      acquisitionDate: new Date().toISOString().split('T')[0],
      condition,
      location: location.trim() || 'Templo Sede',
    };

    onSaveAsset(newAsset);
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="flex flex-col w-full pb-10 px-3 sm:px-6 max-w-6xl mx-auto gap-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-600" /> Patrimônio & Bens Inventariados
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Controle patrimonial, equipamentos de som, instrumentos e imóveis da igreja
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Novo Bem Patrimonial
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-200 uppercase tracking-widest font-bold">
            Valor Total do Patrimônio da Congregação
          </span>
          <div className="text-2xl sm:text-4xl font-black mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              totalValue
            )}
          </div>
          <span className="text-xs text-amber-100/90 mt-1 block">
            {assets.length} bens inventariados e auditados pela Tesouraria
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold border border-white/20">
            Auditado & Verificado
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar bem patrimonial ou localização..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {['todos', 'Imóveis', 'Eletrônicos e Som', 'Móveis e Utensílios', 'Instrumentos Musicais'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'todos' ? 'Todos os Bens' : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  {asset.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {asset.condition}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 mt-2 truncate">{asset.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Local: {asset.location}</p>
              {asset.notes && (
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl">
                  {asset.notes}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Qtd: {asset.quantity} un.</span>
                <span className="font-bold text-sm text-slate-800">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    asset.value * asset.quantity
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setAssetToDelete(asset)}
                className="text-xs font-semibold text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="font-bold text-sm text-slate-800">Cadastrar Bem Patrimonial</span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Item *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Microfone Shure SM58, Caixa JBL..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="Eletrônicos e Som">Eletrônicos e Som</option>
                    <option value="Móveis e Utensílios">Móveis e Utensílios</option>
                    <option value="Instrumentos Musicais">Instrumentos Musicais</option>
                    <option value="Imóveis">Imóveis</option>
                    <option value="Veículos">Veículos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bom">Bom</option>
                    <option value="Regular">Regular</option>
                    <option value="Necessita Reparo">Necessita Reparo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valor Unitário (R$)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Localização no Templo</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ex: Cabine de som, Altar, Sala 1..."
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
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md"
                >
                  Salvar Bem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP CONFIRMATION MODAL FOR ASSET DELETION */}
      {assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col text-center">
            <h3 className="text-lg font-black text-slate-900">
              Confirmar Exclusão de Patrimônio
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Deseja realmente excluir o bem{' '}
              <strong className="text-slate-900">"{assetToDelete.name}"</strong> do inventário da igreja?
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAssetToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteAsset(assetToDelete.id);
                  setAssetToDelete(null);
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

