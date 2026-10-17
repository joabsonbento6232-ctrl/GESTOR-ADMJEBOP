import React, { useState, useRef } from 'react';
import { ChurchBranding } from '../types/church';
import { DEFAULT_LOGO_SVG, DEFAULT_FACADE_IMG } from '../services/storage';
import {
  Palette,
  Image as ImageIcon,
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  Save,
  Building,
  Church,
  BookOpen,
  MapPin,
  Phone,
  User,
  Sparkles,
} from 'lucide-react';

interface CustomizationModuleProps {
  branding: ChurchBranding;
  onUpdateBranding: (updated: ChurchBranding) => void;
}

export const COLOR_PALETTES = [
  { name: 'Azul Pentecostal Clássico', color: '#00236f', description: 'Padrão ADMJEBOP' },
  { name: 'Azul Marinho Real', color: '#1e3a8a', description: 'Elegante e solene' },
  { name: 'Verde Esperança & Missões', color: '#065f46', description: 'Tons ministeriais' },
  { name: 'Vinho Comunhão', color: '#831843', description: 'Celebração e Santa Ceia' },
  { name: 'Índigo Profundo', color: '#312e81', description: 'Moderno e institucional' },
  { name: 'Dourado & Caramelo', color: '#78350f', description: 'Patrimônio e solenidade' },
];

export const CustomizationModule: React.FC<CustomizationModuleProps> = ({
  branding,
  onUpdateBranding,
}) => {
  const [activeTab, setActiveTab] = useState<'imagens' | 'institucional' | 'cores'>('imagens');
  const [formData, setFormData] = useState<ChurchBranding>({ ...branding });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const facadeInputRef = useRef<HTMLInputElement>(null);

  // Upload Logo from Gallery (Requirement!)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      const updated = { ...formData, logoUrl: base64Url };
      setFormData(updated);
      onUpdateBranding(updated);
      triggerSuccess();
    };
    reader.readAsDataURL(file);
  };

  // Upload Temple Facade from Gallery (Requirement!)
  const handleFacadeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      const updated = { ...formData, facadeBannerUrl: base64Url };
      setFormData(updated);
      onUpdateBranding(updated);
      triggerSuccess();
    };
    reader.readAsDataURL(file);
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveInstitutional = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBranding(formData);
    triggerSuccess();
  };

  const handleSelectPalette = (color: string) => {
    const updated = { ...formData, primaryColor: color };
    setFormData(updated);
    onUpdateBranding(updated);
    triggerSuccess();
  };

  const handleResetLogo = () => {
    const updated = { ...formData, logoUrl: DEFAULT_LOGO_SVG };
    setFormData(updated);
    onUpdateBranding(updated);
    triggerSuccess();
  };

  const handleResetFacade = () => {
    const updated = { ...formData, facadeBannerUrl: DEFAULT_FACADE_IMG };
    setFormData(updated);
    onUpdateBranding(updated);
    triggerSuccess();
  };

  return (
    <div className="flex flex-col w-full pb-10 px-3 sm:px-6 max-w-5xl mx-auto gap-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-700" /> Personalização & Cores
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logomarca oficial da igreja, imagem da fachada do templo e dados institucionais
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Alterações salvas e aplicadas no sistema!
          </div>
        )}
      </div>

      {/* Tabs with "Logomarca & Imagens da Igreja" explicitly requested */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1">
        <button
          onClick={() => setActiveTab('imagens')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'imagens'
              ? 'bg-[#00236f] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Logomarca & Imagens da Igreja
        </button>

        <button
          onClick={() => setActiveTab('institucional')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'institucional'
              ? 'bg-[#00236f] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          Edição Institucional
        </button>

        <button
          onClick={() => setActiveTab('cores')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'cores'
              ? 'bg-[#00236f] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          Cores e Temas
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LOGOMARCA & IMAGENS DA IGREJA (REQUESTED)                           */}
      {/* ========================================================================= */}
      {activeTab === 'imagens' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Logomarca Oficial da Igreja */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Topo, Menu & Cabeçalhos
                </span>
                <button
                  onClick={handleResetLogo}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  title="Restaurar logotipo padrão"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Restaurar Padrão
                </button>
              </div>

              <h2 className="text-base font-extrabold text-slate-800 mt-2">
                Logomarca Oficial da Igreja
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Faça upload de qualquer imagem da galeria. O novo logotipo é aplicado imediatamente no topo do sistema, menu lateral e cabeçalhos de cartas e certidões.
              </p>

              {/* Logo Preview Area */}
              <div className="my-5 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-28 h-28 rounded-2xl bg-white p-2 shadow-md border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={formData.logoUrl}
                    alt="Logo Oficial Atual"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-slate-400 mt-3 font-medium">
                  Pré-visualização do logotipo atual
                </span>
              </div>
            </div>

            <div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full py-3 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" /> Selecionar Logomarca da Galeria
              </button>
            </div>
          </div>

          {/* Card 2: Foto da Fachada / Banner do Templo */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Painel de Boas-Vindas
                </span>
                <button
                  onClick={handleResetFacade}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  title="Restaurar fachada padrão"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Restaurar Padrão
                </button>
              </div>

              <h2 className="text-base font-extrabold text-slate-800 mt-2">
                Foto da Fachada / Banner do Templo
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Escolha a foto da fachada da igreja diretamente da sua galeria para ilustrar o banner de boas-vindas do painel principal.
              </p>

              {/* Facade Preview Area */}
              <div className="my-5 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm relative h-36">
                <img
                  src={formData.facadeBannerUrl}
                  alt="Fachada do Templo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold drop-shadow">
                    {formData.churchName} • {formData.congregation}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <input
                ref={facadeInputRef}
                type="file"
                accept="image/*"
                onChange={handleFacadeUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => facadeInputRef.current?.click()}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" /> Selecionar Foto da Fachada da Galeria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EDIÇÃO INSTITUCIONAL                                               */}
      {/* ========================================================================= */}
      {activeTab === 'institucional' && (
        <form
          onSubmit={handleSaveInstitutional}
          className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome da Denominação
              </label>
              <input
                type="text"
                value={formData.churchName}
                onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ministério / Subtítulo
              </label>
              <input
                type="text"
                value={formData.churchSubtitle}
                onChange={(e) => setFormData({ ...formData, churchSubtitle: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Congregação / Cidade
              </label>
              <input
                type="text"
                value={formData.congregation}
                onChange={(e) => setFormData({ ...formData, congregation: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pastor Titular / Presidente
              </label>
              <input
                type="text"
                value={formData.pastorPresidente}
                onChange={(e) => setFormData({ ...formData, pastorPresidente: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Versículo Lema Oficial
              </label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Endereço Completo do Templo
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" /> Salvar Dados Institucionais
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CORES E TEMAS                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'cores' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-800">
            Paleta de Cores e Identidade Visual
          </h2>
          <p className="text-xs text-slate-500">
            Escolha a cor principal que representa a congregação no cabeçalho e nos botões de destaque.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {COLOR_PALETTES.map((pal) => (
              <div
                key={pal.color}
                onClick={() => handleSelectPalette(pal.color)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  formData.primaryColor === pal.color
                    ? 'border-blue-700 bg-blue-50/50 shadow-sm'
                    : 'border-slate-100 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl shadow-md shrink-0 flex items-center justify-center text-white"
                  style={{ backgroundColor: pal.color }}
                >
                  {formData.primaryColor === pal.color && <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{pal.name}</h4>
                  <span className="text-[11px] text-slate-400">{pal.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
