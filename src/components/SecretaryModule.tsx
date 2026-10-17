import React, { useState, useRef } from 'react';
import {
  SecretaryAttachment,
  SecretaryCategory,
  Member,
  ChurchBranding,
} from '../types/church';
import { formatBytes } from '../services/storage';
import {
  FolderOpen,
  Upload,
  FileText,
  File,
  Download,
  Trash2,
  Eye,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  Search,
  Filter,
  FileCheck,
  Printer,
  Archive,
  X,
  FileCode,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface SecretaryModuleProps {
  attachments: SecretaryAttachment[];
  members: Member[];
  branding: ChurchBranding;
  onSaveAttachment: (attachment: SecretaryAttachment) => void;
  onDeleteAttachment: (id: string) => void;
  initialTab?: 'anexos' | 'emissao' | 'atas';
}

export const SECRETARY_CATEGORIES: SecretaryCategory[] = [
  'Atas e Termos',
  'Documentação do Imóvel',
  'Estatuto e Regimento',
  'Certidões e Cartas',
  'Relatórios Financeiros',
  'Outros Documentos',
];

export const SecretaryModule: React.FC<SecretaryModuleProps> = ({
  attachments,
  members,
  branding,
  onSaveAttachment,
  onDeleteAttachment,
  initialTab = 'anexos',
}) => {
  const [activeTab, setActiveTab] = useState<'anexos' | 'emissao' | 'atas'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState<SecretaryAttachment | null>(null);
  const [docToDelete, setDocToDelete] = useState<SecretaryAttachment | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<SecretaryCategory>('Atas e Termos');
  const [uploadAuthor, setUploadAuthor] = useState('Secretaria Geral');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadFile, setUploadFile] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Certificate / Letter Generator State
  const [certType, setCertType] = useState<
    'carta_recomendacao' | 'certidao_batismo' | 'apresentacao_crianca' | 'certificado_membresia'
  >('carta_recomendacao');
  const [certMemberId, setCertMemberId] = useState<string>(members[0]?.id || '');
  const [certDestChurch, setCertDestChurch] = useState('Assembleia de Deus');
  const [certDestCity, setCertDestCity] = useState('João Pessoa - PB');
  const [certCustomNotes, setCertCustomNotes] = useState('');
  const [certChildName, setCertChildName] = useState('Davi dos Santos');
  const [certParentsName, setCertParentsName] = useState('João da Silva Santos e Ester Santos');

  const selectedMember = members.find((m) => m.id === certMemberId) || members[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredAttachments = attachments.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'todos' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle file selection from local device (PDF, DOCX, Images, etc.)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase() || 'arquivo';

      let fileType = 'pdf';
      if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) fileType = 'image';
      else if (['doc', 'docx'].includes(extension)) fileType = 'docx';
      else if (['xls', 'xlsx'].includes(extension)) fileType = 'xlsx';

      setUploadFile({
        name: file.name,
        size: formatBytes(file.size),
        type: fileType,
        dataUrl,
      });

      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit manual upload
  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newDoc: SecretaryAttachment = {
      id: 'sec-doc-' + Date.now(),
      title: uploadTitle.trim(),
      category: uploadCategory,
      fileName: uploadFile?.name || `${uploadTitle.replace(/\s+/g, '_')}.pdf`,
      fileType: uploadFile?.type || 'pdf',
      fileSize: uploadFile?.size || '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      author: uploadAuthor.trim() || 'Secretaria Geral',
      description: uploadNotes.trim(),
      fileDataUrl: uploadFile?.dataUrl,
    };

    onSaveAttachment(newDoc);
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadNotes('');
    setUploadFile(null);
    showToast('Documento anexado com sucesso nos arquivos da Secretaria!');
  };

  // KEY USER REQUIREMENT: "Salvar Cópia nos Arquivos da Secretaria" com 1 clique!
  const handleArchiveCertificate = () => {
    const certNames = {
      carta_recomendacao: 'Carta de Recomendação',
      certidao_batismo: 'Certidão de Batismo nas Águas',
      apresentacao_crianca: 'Certificado de Apresentação de Criança',
      certificado_membresia: 'Certificado Oficial de Membresia',
    };

    const docTitle = `${certNames[certType]} - ${
      certType === 'apresentacao_crianca' ? certChildName : selectedMember?.name
    }`;

    const newArchivedDoc: SecretaryAttachment = {
      id: 'sec-archived-' + Date.now(),
      title: docTitle,
      category: 'Certidões e Cartas',
      fileName: `${docTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      fileType: 'pdf',
      fileSize: '480 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      author: 'Secretária geral (Emissão de Cartas)',
      description: `Cópia arquivada oficialmente. Emitida para ${
        certType === 'apresentacao_crianca' ? certChildName : selectedMember?.name
      }. Pastor: ${branding.pastorPresidente}.`,
      isOfficialCopy: true,
    };

    onSaveAttachment(newArchivedDoc);
    showToast('Cópia arquivada com 1 clique nos Anexos da Secretaria sob a categoria "Certidões e Cartas"!');
  };

  // Download document
  const handleDownload = (doc: SecretaryAttachment) => {
    if (doc.fileDataUrl) {
      const a = document.createElement('a');
      a.href = doc.fileDataUrl;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Generate synthetic downloadable text blob
      const content = `ASSEMBLEIA DE DEUS - MINISTÉRIO JESUS O BOM PASTOR
CONGREGAÇÃO DE REMÍGIO - PB
DOCUMENTO OFICIAL DA SECRETARIA

Título: ${doc.title}
Categoria: ${doc.category}
Arquivo: ${doc.fileName}
Data de Inclusão: ${doc.uploadDate}
Responsável: ${doc.author}
Descrição: ${doc.description || 'Documento ministerial arquivado sob fé pública eclesiástica.'}

Certificamos que este documento faz parte do acervo oficial da ADMJEBOP Remígio-PB.
Pastor Presidente: ${branding.pastorPresidente}
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName.endsWith('.txt') ? doc.fileName : `${doc.fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 px-3 sm:px-6 max-w-6xl mx-auto gap-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold border border-emerald-400 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar of Secretaria */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-slate-700" /> Secretaria Geral da Igreja
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão de Atas, Anexos da Secretaria, Escrituras e Emissão de Cartas & Certidões
          </p>
        </div>

        {/* Primary Action Button: "Anexos da Secretaria" as requested! */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('anexos');
              setIsUploadModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4" /> Anexos da Secretaria (Novo Arquivo)
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1">
        <button
          onClick={() => setActiveTab('anexos')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'anexos'
              ? 'bg-[#00236f] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Anexos da Secretaria ({attachments.length})
        </button>

        <button
          onClick={() => setActiveTab('emissao')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'emissao'
              ? 'bg-[#00236f] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Emissão de Cartas & Certidões
        </button>

        <button
          onClick={() => setActiveTab('atas')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'atas'
              ? 'bg-[#00236f] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Livro de Atas & Termos
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ANEXOS DA SECRETARIA (DEDICATED AREA WITH CATEGORY FILTERS)         */}
      {/* ========================================================================= */}
      {activeTab === 'anexos' && (
        <div className="space-y-4">
          {/* Category Filters Bar as requested */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar arquivo, ata, escritura, balancete..."
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                />
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" /> Upload de Documento
              </button>
            </div>

            {/* Filter Pills with all requested categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedCategory('todos')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === 'todos'
                    ? 'bg-[#00236f] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas as Categorias ({attachments.length})
              </button>

              {SECRETARY_CATEGORIES.map((cat) => {
                const count = attachments.filter((a) => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#00236f] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAttachments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      doc.fileType === 'pdf'
                        ? 'bg-red-50 text-red-600'
                        : doc.fileType === 'docx'
                        ? 'bg-blue-50 text-blue-600'
                        : doc.fileType === 'xlsx'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    {doc.fileType === 'image' ? (
                      <ImageIcon className="w-6 h-6" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                      {doc.category}
                    </span>
                    <h3
                      onClick={() => setPreviewDoc(doc)}
                      className="font-bold text-sm text-slate-900 mt-1 line-clamp-2 cursor-pointer hover:text-blue-700 transition-colors"
                      title={doc.title}
                    >
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{doc.fileName}</p>
                  </div>
                </div>

                {doc.description && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 bg-slate-50 p-2 rounded-xl">
                    {doc.description}
                  </p>
                )}

                {/* Footer with file info and actions */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-700">{doc.fileSize}</span>
                    <span className="text-[10px] text-slate-400">{doc.uploadDate}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Pré-visualizar Documento"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                      title="Download do Arquivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocToDelete(doc)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Excluir Arquivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredAttachments.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
                <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-1" />
                <p className="text-sm font-semibold text-slate-700">Nenhum anexo encontrado nesta categoria</p>
                <p className="text-xs text-slate-400">
                  Clique em "Anexos da Secretaria" acima para enviar atas, escrituras ou relatórios.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EMISSÃO DE CARTAS E CERTIDÕES (WITH 1-CLICK ARCHIVE FEATURE!)       */}
      {/* ========================================================================= */}
      {activeTab === 'emissao' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Controls Form */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-700" /> Configuração do Documento
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipo de Certidão / Carta
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              >
                <option value="carta_recomendacao">Carta de Mudança / Recomendação</option>
                <option value="certidao_batismo">Certidão de Batismo nas Águas</option>
                <option value="apresentacao_crianca">Certificado de Apresentação de Crianças</option>
                <option value="certificado_membresia">Certificado Oficial de Membresia</option>
              </select>
            </div>

            {certType !== 'apresentacao_crianca' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Membro Selecionado
                </label>
                <select
                  value={certMemberId}
                  onChange={(e) => setCertMemberId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Criança
                  </label>
                  <input
                    type="text"
                    value={certChildName}
                    onChange={(e) => setCertChildName(e.target.value)}
                    placeholder="Nome completo do infante"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pais / Responsáveis
                  </label>
                  <input
                    type="text"
                    value={certParentsName}
                    onChange={(e) => setCertParentsName(e.target.value)}
                    placeholder="Nome do Pai e da Mãe"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>
            )}

            {certType === 'carta_recomendacao' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Igreja de Destino
                  </label>
                  <input
                    type="text"
                    value={certDestChurch}
                    onChange={(e) => setCertDestChurch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cidade de Destino
                  </label>
                  <input
                    type="text"
                    value={certDestCity}
                    onChange={(e) => setCertDestCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* KEY USER ACTION BUTTONS */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {/* Salvar Cópia nos Arquivos da Secretaria (Requested!) */}
              <button
                type="button"
                onClick={handleArchiveCertificate}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
              >
                <Archive className="w-4 h-4" />
                Salvar Cópia nos Arquivos da Secretaria
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" /> Imprimir Documento Oficial
              </button>
            </div>
          </div>

          {/* Official Document Live Sheet Preview */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg text-slate-900 font-serif relative">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <img src={branding.logoUrl} alt="Marca d'água" className="w-96 h-96 object-contain" />
            </div>

            {/* Header with church logo & typography */}
            <div className="text-center pb-5 border-b-2 border-slate-900/80 mb-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl p-1 bg-white border border-slate-300 shadow-sm mb-2">
                <img
                  src={branding.logoUrl}
                  alt="Logo da Igreja"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-lg sm:text-xl tracking-wider uppercase font-sans text-[#00236f]">
                {branding.churchName}
              </h3>
              <h4 className="text-sm font-semibold font-sans text-slate-700">
                {branding.churchSubtitle}
              </h4>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {branding.congregation} • Remígio - Estado da Paraíba
              </p>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 italic">
                {branding.motto}
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center mb-6">
              <span className="text-base sm:text-lg font-bold uppercase tracking-widest border-b border-slate-400 pb-1 font-sans">
                {certType === 'carta_recomendacao' && 'Carta de Mudança e Recomendação'}
                {certType === 'certidao_batismo' && 'Certidão de Batismo nas Águas'}
                {certType === 'apresentacao_crianca' && 'Certificado de Apresentação de Crianças'}
                {certType === 'certificado_membresia' && 'Certificado Oficial de Membresia'}
              </span>
            </div>

            {/* Document Text Body */}
            <div className="text-xs sm:text-sm leading-relaxed text-justify space-y-4 font-sans text-slate-800">
              {certType === 'carta_recomendacao' && (
                <>
                  <p>
                    À amada Igreja em <strong>{certDestChurch}</strong> - {certDestCity},
                  </p>
                  <p>
                    A Paz do Senhor Jesus Cristo.
                  </p>
                  <p>
                    Recomendamos com alegria na comunhão do Senhor o(a) nosso(a) irmão(ã){' '}
                    <strong className="text-blue-900">{selectedMember?.name}</strong>, exercente da
                    função de <strong>{selectedMember?.role}</strong>, membro em plena comunhão com a
                    Santa Ceia e doutrina bíblica nesta Congregação de Remígio-PB.
                  </p>
                  <p>
                    Pedimos que o(a) acolhais no Senhor de maneira digna dos santos, auxiliando-o(a)
                    em tudo o que de vós precisar.
                  </p>
                </>
              )}

              {certType === 'certidao_batismo' && (
                <>
                  <p>
                    Certificamos para os devidos fins eclesiásticos que o(a) irmão(ã){' '}
                    <strong className="text-blue-900">{selectedMember?.name}</strong> desceu às águas
                    batismais em nome do Pai, do Filho e do Espírito Santo, conforme o mandamento do
                    Senhor Jesus Cristo (Mateus 28:19), passando a integrar o rol oficial de membros da
                    Assembleia de Deus Ministério Jesus o Bom Pastor.
                  </p>
                  <p>
                    Data do Batismo: <strong>{selectedMember?.baptismDate || 'Conforme Ata'}</strong>.
                  </p>
                </>
              )}

              {certType === 'apresentacao_crianca' && (
                <>
                  <p>
                    Certificamos que o infante <strong>{certChildName}</strong>, filho(a) de{' '}
                    <strong>{certParentsName}</strong>, foi apresentado(a) ao Senhor Jesus Cristo no
                    Templo Sede desta congregação, recebendo a oração e bênção pastoral segundo o
                    exemplo bíblico (Lucas 2:22).
                  </p>
                </>
              )}

              {certType === 'certificado_membresia' && (
                <>
                  <p>
                    Certificamos que <strong>{selectedMember?.name}</strong> está devidamente
                    registrado(a) sob o Rol Oficial Nº{' '}
                    <strong>{selectedMember?.id.replace('mem-', 'ROL-00')}</strong>, servindo a Deus no
                    cargo de <strong>{selectedMember?.role}</strong>, sendo membro ativo e assíduo.
                  </p>
                </>
              )}
            </div>

            {/* Date and Pastor Signatures */}
            <div className="mt-12 pt-6 border-t border-slate-200 font-sans">
              <p className="text-right text-xs text-slate-500 mb-8">
                Remígio - PB, {new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })}.
              </p>

              <div className="grid grid-cols-2 gap-8 text-center pt-4">
                <div className="border-t border-slate-400 pt-1">
                  <span className="block text-xs font-bold text-slate-800">
                    {branding.pastorPresidente}
                  </span>
                  <span className="text-[10px] text-slate-500">Pastor Titular do Campo</span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <span className="block text-xs font-bold text-slate-800">
                    Ana Paula Souza
                  </span>
                  <span className="text-[10px] text-slate-500">Secretária Geral</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LIVRO DE ATAS                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'atas' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" /> Registro do Livro de Atas do Templo
          </h2>
          <p className="text-xs text-slate-500">
            Atas deliberativas de assembleias gerais, reuniões de diretoria e posse de obreiros.
          </p>

          <div className="divide-y divide-slate-100">
            {attachments
              .filter((a) => a.category === 'Atas e Termos')
              .map((ata) => (
                <div
                  key={ata.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{ata.title}</h4>
                      <span className="text-xs text-slate-400">
                        {ata.uploadDate} • Responsável: {ata.author}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDoc(ata)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver
                    </button>
                    <button
                      onClick={() => handleDownload(ata)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Baixar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* UPLOAD MODAL ("Anexos da Secretaria") */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#00236f] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-200" />
                <span className="font-bold text-sm sm:text-base">
                  Anexar Documento na Secretaria
                </span>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl bg-blue-50/50 hover:bg-blue-50 cursor-pointer text-center transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-10 h-10 mx-auto text-blue-600 group-hover:scale-110 transition-transform mb-2" />
                {uploadFile ? (
                  <div className="text-slate-800">
                    <span className="font-bold text-sm block truncate">{uploadFile.name}</span>
                    <span className="text-xs text-blue-700 font-semibold">{uploadFile.size}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      Clique para escolher o arquivo da galeria / dispositivo
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      PDF, DOCX, XLSX ou imagens de contratos, atas assinadas, escrituras e relatórios
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título do Documento *
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="ex: Escritura do Terreno Anexo, Ata nº 45..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                />
              </div>

              {/* Categorias Filter Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoria da Secretaria *
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as SecretaryCategory)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                >
                  {SECRETARY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Responsável / Autor
                </label>
                <input
                  type="text"
                  value={uploadAuthor}
                  onChange={(e) => setUploadAuthor(e.target.value)}
                  placeholder="ex: Secretária geral, Pr. Presidente"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observações / Resumo
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Detalhes sobre o conteúdo arquivado..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/20"
                >
                  Salvar nos Arquivos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#00236f] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-5 h-5 text-blue-200 shrink-0" />
                <span className="font-bold text-sm sm:text-base truncate">
                  {previewDoc.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-blue-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block">Categoria</span>
                  <span className="font-bold text-blue-800">{previewDoc.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tamanho</span>
                  <span className="font-bold text-slate-700">{previewDoc.fileSize}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Data de Arquivamento</span>
                  <span className="font-bold text-slate-700">{previewDoc.uploadDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Autor</span>
                  <span className="font-bold text-slate-700">{previewDoc.author}</span>
                </div>
              </div>

              {previewDoc.fileType === 'image' && previewDoc.fileDataUrl ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-2 flex items-center justify-center">
                  <img
                    src={previewDoc.fileDataUrl}
                    alt={previewDoc.title}
                    className="max-h-96 object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-mono leading-relaxed space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-200 pb-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Visualizador de Documentos da Secretaria ADMJEBOP Remígio</span>
                  </div>
                  <p>Arquivo: {previewDoc.fileName}</p>
                  <p>Status: Documento registrado e chancelado no acervo da igreja.</p>
                  <p>
                    Descrição / Sumário:{' '}
                    {previewDoc.description || 'Documento oficial sob custódia da Secretaria Geral.'}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {previewDoc.isOfficialCopy ? 'Cópia Oficial Arquivada' : 'Anexo de Secretaria'}
              </span>
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" /> Baixar Documento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP CONFIRMATION MODAL FOR DOCUMENT DELETION */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Confirmar Exclusão de Arquivo
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Deseja realmente apagar o documento{' '}
              <strong className="text-slate-900">"{docToDelete.title}"</strong> ({docToDelete.category}) dos arquivos da secretaria?
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const title = docToDelete.title;
                  onDeleteAttachment(docToDelete.id);
                  setDocToDelete(null);
                  showToast(`Documento "${title}" apagado com sucesso!`);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all"
              >
                Sim, Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

