import React, { useState, useRef } from 'react';
import { Member, EcclesiasticalRole, ChurchBranding, AppUser } from '../types/church';
import { getWhatsAppLink } from '../services/storage';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Edit2,
  Trash2,
  X,
  Camera,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Printer,
  Shield,
  Heart,
  FileText,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';

interface MembersModuleProps {
  members: Member[];
  branding: ChurchBranding;
  onSaveMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  selectedMemberId?: string | null;
  onClearSelectedMember?: () => void;
  onSaveUser?: (user: AppUser) => void;
  registeredUsers?: AppUser[];
}

export const NEW_ECCLESIASTICAL_ROLES: { role: string; description: string; badge: string }[] = [
  {
    role: 'Dirigente Vaso de Unção (Círculo de Oração)',
    description: 'Liderança espiritual do Círculo de Oração feminino',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    role: 'Dirigente Apocalipse (Juventude)',
    description: 'Coordenação dos jovens e adolescentes da congregação',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    role: 'Dirigente Gideão (Grupo de Varões)',
    description: 'Liderança do grupo de homens e varões em oração e ação',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    role: 'Dirigente ministério de louvor',
    description: 'Direção geral da sonoplastia, músicos e escalas de adoração',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    role: 'Dirigente shalon adonai (Grupo de Louvor)',
    description: 'Coordenação e regência do grupo de louvor Shalon Adonai',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  {
    role: 'Dirigente secretaria de Missões',
    description: 'Supervisão do trabalho missionário urbano, estadual e transcultural',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    role: 'Secretária de Missões',
    description: 'Registro de relatórios, correspondências e finanças de missões',
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    role: 'Secretária geral',
    description: 'Gestão de atas, membros, certidões e arquivos do templo',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    role: 'Dirigente de casais (Ministério da Família)',
    description: 'Acompanhamento pastoral de noivos, casais e aconselhamento familiar',
    badge: 'bg-pink-100 text-pink-800 border-pink-200',
  },
];

export const TRADITIONAL_ROLES = [
  'Pastor',
  'Pastor Auxiliar',
  'Presbítero',
  'Evangelista',
  'Diácono',
  'Diaconisa',
  'Missionário(a)',
  'Cooperador(a)',
  'Auxiliar',
  'Líder de ministério',
  'Professor(a) EBD',
  'Secretária',
  'Membro sem cargo',
  'Membro',
  'Outros',
];

export const MembersModule: React.FC<MembersModuleProps> = ({
  members,
  branding,
  onSaveMember,
  onDeleteMember,
  selectedMemberId,
  onClearSelectedMember,
  onSaveUser,
  registeredUsers = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [activeMemberModal, setActiveMemberModal] = useState<Member | null>(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Partial<Member>>({});
  const [activeTabFicha, setActiveTabFicha] = useState<'dados' | 'familia' | 'documentos' | 'anexos'>('dados');
  const [printCredentialMember, setPrintCredentialMember] = useState<Member | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // In-App Deletion Modal State (replaces failing window.confirm)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Hidden input refs for gallery image upload
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const editModalGalleryInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // If selectedMemberId prop changes from global search, open that member
  React.useEffect(() => {
    if (selectedMemberId) {
      const found = members.find((m) => m.id === selectedMemberId);
      if (found) {
        setActiveMemberModal(found);
      }
    }
  }, [selectedMemberId, members]);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'todos' || m.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Handle direct photo update from gallery (FileReader to Base64)
  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetMemberId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;

      if (isEditingModalOpen) {
        setMemberToEdit((prev) => ({ ...prev, photo: base64Url }));
      }

      if (activeMemberModal && (!targetMemberId || targetMemberId === activeMemberModal.id)) {
        const updated: Member = { ...activeMemberModal, photo: base64Url };
        setActiveMemberModal(updated);
        onSaveMember(updated);
        showToast('Foto de perfil atualizada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenNewMember = () => {
    const today = new Date().toISOString().split('T')[0];
    setMemberToEdit({
      id: 'mem-' + Date.now(),
      name: '',
      role: 'Membro',
      status: 'Ativo',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      phone: '(83) 9',
      email: '',
      birthDate: '1995-01-01',
      entryDate: today, // Dia da entrada na congregação padrão para hoje
      entryType: 'Batismo nas Águas',
      address: '',
      neighborhood: 'Centro',
      city: 'Remígio - PB',
      maritalStatus: 'Solteiro(a)',
      spouseName: '',
      observations: '',
      directPastor: branding.pastorPresidente,
    });
    setIsEditingModalOpen(true);
  };

  const handleOpenEditMember = (member: Member) => {
    setMemberToEdit({
      ...member,
      maritalStatus: member.maritalStatus || 'Solteiro(a)',
      entryDate: member.entryDate || new Date().toISOString().split('T')[0],
      entryType: member.entryType || 'Batismo nas Águas',
    });
    setIsEditingModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberToEdit.name || !memberToEdit.role) return;

    const memberId = memberToEdit.id || 'mem-' + Date.now();
    const finalMember: Member = {
      id: memberId,
      name: memberToEdit.name,
      role: memberToEdit.role,
      status: memberToEdit.status || 'Ativo',
      photo: memberToEdit.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      phone: memberToEdit.phone || '(83) 98765-4321',
      email: memberToEdit.email || '',
      birthDate: memberToEdit.birthDate || '1990-01-01',
      baptismDate: memberToEdit.baptismDate || '',
      entryDate: memberToEdit.entryDate || new Date().toISOString().split('T')[0],
      entryType: memberToEdit.entryType || 'Batismo nas Águas',
      address: memberToEdit.address || 'Remígio - PB',
      neighborhood: memberToEdit.neighborhood || 'Centro',
      city: memberToEdit.city || 'Remígio - PB',
      maritalStatus: memberToEdit.maritalStatus || 'Solteiro(a)',
      spouseName: memberToEdit.maritalStatus === 'Casado(a)' ? memberToEdit.spouseName || '' : '',
      familyId: memberToEdit.familyId || '',
      familyName: memberToEdit.familyName || '',
      observations: memberToEdit.observations || '',
      directPastor: memberToEdit.directPastor || branding.pastorPresidente,
    };

    onSaveMember(finalMember);
    setIsEditingModalOpen(false);
    showToast(`Cadastro de ${finalMember.name} salvo com sucesso!`);

    // Update active modal if it was open
    if (activeMemberModal && activeMemberModal.id === finalMember.id) {
      setActiveMemberModal(finalMember);
    }
  };

  // Secure deletion logic (executed when user confirms in in-app modal)
  const handleExecuteDelete = () => {
    if (!memberToDelete) return;
    const name = memberToDelete.name;
    const id = memberToDelete.id;

    onDeleteMember(id);
    setMemberToDelete(null);

    // If Ficha modal is displaying the deleted member, close it
    if (activeMemberModal && activeMemberModal.id === id) {
      setActiveMemberModal(null);
      onClearSelectedMember?.();
    }

    // If Edit modal was open for this member, close it
    if (isEditingModalOpen && memberToEdit.id === id) {
      setIsEditingModalOpen(false);
    }

    showToast(`O membro "${name}" foi apagado do rol da congregação.`);
  };

  return (
    <div className="flex flex-col w-full pb-10 px-3 sm:px-6 max-w-6xl mx-auto gap-4">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold border border-emerald-400 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header bar of Membros Module */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-700" /> Rol Geral de Membros
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro, credenciais e funções eclesiásticas de Remígio-PB
          </p>
        </div>

        <button
          onClick={handleOpenNewMember}
          className="px-4 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Novo Membro
        </button>
      </div>

      {/* Role filter chips & Search */}
      <div className="flex flex-col gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, telefone, bairro ou cargo..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
          />
        </div>

        {/* Roles Quick Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setRoleFilter('todos')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              roleFilter === 'todos'
                ? 'bg-[#00236f] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({members.length})
          </button>

          {/* New Roles Highlighted as asked in prompt */}
          {NEW_ECCLESIASTICAL_ROLES.map((item) => (
            <button
              key={item.role}
              onClick={() => setRoleFilter(item.role)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
                roleFilter === item.role
                  ? 'bg-blue-800 text-white border-blue-900 shadow-sm'
                  : `${item.badge} hover:opacity-80`
              }`}
            >
              {item.role.replace(/ \(.+\)/, '')}
            </button>
          ))}

          {/* Traditional Roles */}
          {['Pastor', 'Presbítero', 'Evangelista', 'Diácono', 'Diaconisa'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                roleFilter === r
                  ? 'bg-[#00236f] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                    member.status === 'Ativo' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  title={member.status}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  onClick={() => setActiveMemberModal(member)}
                  className="font-bold text-sm sm:text-base text-slate-900 truncate cursor-pointer hover:text-blue-700 transition-colors"
                >
                  {member.name}
                </h3>
                <span className="inline-block mt-0.5 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 truncate max-w-full">
                  {member.role}
                </span>

                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.neighborhood} - Remígio</span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-600">{member.maritalStatus}</span>
                  <span>•</span>
                  <span>Entrada: {member.entryDate}</span>
                </div>
              </div>
            </div>

            {/* Member Action Bar with prominent APAGAR / DELETAR button! */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {/* WhatsApp One-Click Direct Link */}
              <a
                href={getWhatsAppLink(
                  member.phone,
                  `A Paz do Senhor Jesus, irmão(ã) ${member.name}! Aqui é da liderança da ADMJEBOP Remígio.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors truncate"
                title="Conversar direto no WhatsApp"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{member.phone}</span>
              </a>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setActiveMemberModal(member)}
                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Abrir Ficha Completa"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEditMember(member)}
                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar Membro"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {/* APAGAR / DELETAR direto no card! */}
                <button
                  onClick={() => setMemberToDelete(member)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Apagar / Deletar Membro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-slate-700">Nenhum membro encontrado</p>
            <p className="text-xs text-slate-400">Verifique o filtro de cargo ou o termo pesquisado.</p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FICHA DO MEMBRO (View Modal)                                              */}
      {/* ========================================================================= */}
      {activeMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#00236f] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-200" />
                <span className="font-bold text-sm sm:text-base">Ficha do Membro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPrintCredentialMember(activeMemberModal)}
                  className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg"
                  title="Imprimir Credencial / Carteira de Membro"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEditMember(activeMemberModal)}
                  className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg"
                  title="Editar Dados"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveMemberModal(null);
                    onClearSelectedMember?.();
                  }}
                  className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Banner with Photo & Direct Gallery Upload */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group shrink-0">
                <img
                  src={activeMemberModal.photo}
                  alt={activeMemberModal.name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-md"
                />

                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#00236f] hover:bg-blue-800 text-white rounded-xl shadow-lg ring-2 ring-white active:scale-95 transition-all"
                  title="Selecionar foto diretamente da galeria"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, activeMemberModal.id)}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 truncate">
                    {activeMemberModal.name}
                  </h2>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-center sm:self-auto">
                    {activeMemberModal.status}
                  </span>
                </div>

                <div className="mt-1">
                  <span className="text-xs font-bold text-blue-900 bg-blue-100/70 px-2.5 py-1 rounded-lg">
                    {activeMemberModal.role}
                  </span>
                </div>

                {/* Action buttons under photo: "Selecionar da galeria" explicitly */}
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
                    Selecionar da galeria
                  </button>

                  <a
                    href={getWhatsAppLink(
                      activeMemberModal.phone,
                      `A Paz do Senhor Jesus, irmão(ã) ${activeMemberModal.name}! Contato da Secretaria Geral da ADMJEBOP Remígio.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Tabs in Ficha */}
            <div className="flex items-center border-b border-slate-100 px-4 bg-white text-xs font-bold overflow-x-auto">
              {(['dados', 'familia', 'documentos', 'anexos'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTabFicha(tab)}
                  className={`py-3 px-3 uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                    activeTabFicha === tab
                      ? 'border-[#00236f] text-[#00236f]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'familia' ? 'Família' : tab}
                </button>
              ))}
            </div>

            {/* Modal Body Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 text-xs sm:text-sm space-y-4">
              {activeTabFicha === 'dados' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Informações Pessoais & Eclesiásticas
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                      <div>
                        <span className="text-slate-400 text-xs block">Estado Civil</span>
                        <span className="font-semibold text-slate-900">
                          {activeMemberModal.maritalStatus || 'Não informado'}
                          {activeMemberModal.maritalStatus === 'Casado(a)' && activeMemberModal.spouseName && (
                            <span className="text-xs text-slate-500 block">
                              Cônjuge: {activeMemberModal.spouseName}
                            </span>
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">
                          Dia da Entrada na Congregação
                        </span>
                        <span className="font-semibold text-blue-900 flex items-center gap-1">
                          <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                          {activeMemberModal.entryDate || 'Não informada'}
                          {activeMemberModal.entryType && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({activeMemberModal.entryType})
                            </span>
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Data de Nascimento</span>
                        <span className="font-semibold">{activeMemberModal.birthDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Telefone / WhatsApp</span>
                        <a
                          href={getWhatsAppLink(activeMemberModal.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          {activeMemberModal.phone} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Endereço Residencial</span>
                        <span className="font-semibold">
                          {activeMemberModal.address}, {activeMemberModal.neighborhood}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Batismo nas Águas</span>
                        <span className="font-semibold">
                          {activeMemberModal.baptismDate || 'Não informado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Função na Congregação & Ministério
                    </span>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-700" />
                      <span className="text-sm font-bold text-blue-900">
                        {activeMemberModal.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Responsável Direto: {activeMemberModal.directPastor || branding.pastorPresidente}
                    </p>
                    {activeMemberModal.observations && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60">
                        <span className="text-slate-400 text-xs block">Observações Ministeriais:</span>
                        <p className="text-slate-600 text-xs italic mt-0.5">
                          "{activeMemberModal.observations}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTabFicha === 'familia' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-400 block">Estado Civil</span>
                    <span className="text-sm font-bold text-slate-800">
                      {activeMemberModal.maritalStatus}
                    </span>
                    {activeMemberModal.spouseName && (
                      <div className="mt-2">
                        <span className="text-xs text-slate-400 block">Cônjuge</span>
                        <span className="text-sm font-semibold text-slate-800">
                          {activeMemberModal.spouseName}
                        </span>
                      </div>
                    )}
                  </div>
                  {activeMemberModal.familyName && (
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <span className="text-xs text-emerald-700 font-semibold block">
                        Núcleo Familiar Registrado
                      </span>
                      <span className="text-sm font-bold text-emerald-900">
                        {activeMemberModal.familyName}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeTabFicha === 'documentos' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-400 block">Batismo nas Águas</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {activeMemberModal.baptismDate || 'Não informado'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-400 block">Registro Geral (Rol)</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Nº {activeMemberModal.id.replace('mem-', 'ROL-00')}
                      </span>
                    </div>
                  </div>
                </div>
              )}



              {activeTabFicha === 'anexos' && (
                <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4">
                  <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-600">
                    Documentos Pessoais & Certidões do Membro
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Certidões emitidas na Secretaria com o botão "Salvar Cópia" ficam catalogadas
                    automaticamente.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              {/* APAGAR / DELETAR SEGURO SEM WINDOW.CONFIRM */}
              <button
                type="button"
                onClick={() => setMemberToDelete(activeMemberModal)}
                className="px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" /> Apagar Membro
              </button>

              <button
                type="button"
                onClick={() => handleOpenEditMember(activeMemberModal)}
                className="px-5 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" /> Editar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT / CREATE MEMBER MODAL WITH TABS FOR DADOS & LOGIN/SENHA              */}
      {/* ========================================================================= */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
            <div className="p-4 bg-[#00236f] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-200" />
                <span className="font-bold text-sm sm:text-base">
                  {memberToEdit.id && members.some((m) => m.id === memberToEdit.id)
                    ? 'Editar Dados do Membro'
                    : 'Cadastrar Novo Membro'}
                </span>
              </div>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="space-y-4">
                  {/* Photo Upload Directly from Gallery */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img
                      src={memberToEdit.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                      alt="Prévia da foto"
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-700/20 shadow-sm"
                    />
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <span className="text-xs font-bold text-slate-800 block">Foto de Perfil</span>
                      <p className="text-[11px] text-slate-500">
                        O arquivo é lido diretamente do seu dispositivo e atualizado na hora em alta qualidade.
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => editModalGalleryInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Selecionar da galeria
                        </button>
                        <input
                          ref={editModalGalleryInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setMemberToEdit((prev) => ({
                              ...prev,
                              photo:
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
                            }))
                          }
                          className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:bg-slate-200 text-xs font-semibold"
                        >
                          Remover foto
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={memberToEdit.name || ''}
                        onChange={(e) => setMemberToEdit({ ...memberToEdit, name: e.target.value })}
                        placeholder="Nome do irmão(ã)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp / Telefone *
                      </label>
                      <input
                        type="text"
                        required
                        value={memberToEdit.phone || ''}
                        onChange={(e) => setMemberToEdit({ ...memberToEdit, phone: e.target.value })}
                        placeholder="(83) 98765-4321"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                      />
                    </div>
                  </div>

                  {/* SELEÇÃO DE CARGO / FUNÇÃO ECLESIÁSTICA */}
                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2">
                    <label className="block text-xs font-bold text-blue-900 uppercase tracking-wide">
                      Função Eclesiástica na Congregação *
                    </label>

                    <select
                      value={memberToEdit.role || 'Membro'}
                      onChange={(e) => setMemberToEdit({ ...memberToEdit, role: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-blue-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                    >
                      <optgroup label="⭐ Novas Funções Eclesiásticas da Congregação">
                        <option value="Dirigente Vaso de Unção (Círculo de Oração)">
                          Dirigente Vaso de Unção (Círculo de Oração)
                        </option>
                        <option value="Dirigente Apocalipse (Juventude)">
                          Dirigente Apocalipse (Juventude)
                        </option>
                        <option value="Dirigente Gideão (Grupo de Varões)">
                          Dirigente Gideão (Grupo de Varões)
                        </option>
                        <option value="Dirigente ministério de louvor">
                          Dirigente ministério de louvor
                        </option>
                        <option value="Dirigente shalon adonai (Grupo de Louvor)">
                          Dirigente shalon adonai (Grupo de Louvor)
                        </option>
                        <option value="Dirigente secretaria de Missões">
                          Dirigente secretaria de Missões
                        </option>
                        <option value="Secretária de Missões">Secretária de Missões</option>
                        <option value="Secretária geral">Secretária geral</option>
                        <option value="Dirigente de casais (Ministério da Família)">
                          Dirigente de casais (Ministério da Família)
                        </option>
                      </optgroup>

                      <optgroup label="Cargos Ministeriais e Gerais">
                        <option value="Pastor">Pastor</option>
                        <option value="Presbítero">Presbítero</option>
                        <option value="Evangelista">Evangelista</option>
                        <option value="Diácono">Diácono</option>
                        <option value="Diaconisa">Diaconisa</option>
                        <option value="Missionário(a)">Missionário(a)</option>
                        <option value="Cooperador(a)">Cooperador(a)</option>
                        <option value="Auxiliar">Auxiliar</option>
                        <option value="Líder de ministério">Líder de ministério</option>
                        <option value="Professor(a) EBD">Professor(a) EBD</option>
                        <option value="Membro sem cargo">Membro sem cargo</option>
                        <option value="Membro">Membro</option>
                        <option value="Outros">Outros</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* ESTADO CIVIL & CÔNJUGE (Explicitly requested!) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Estado Civil *
                      </label>
                      <select
                        value={memberToEdit.maritalStatus || 'Solteiro(a)'}
                        onChange={(e) =>
                          setMemberToEdit({
                            ...memberToEdit,
                            maritalStatus: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      >
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                      </select>
                    </div>

                    {memberToEdit.maritalStatus === 'Casado(a)' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nome do Cônjuge
                        </label>
                        <input
                          type="text"
                          value={memberToEdit.spouseName || ''}
                          onChange={(e) =>
                            setMemberToEdit({ ...memberToEdit, spouseName: e.target.value })
                          }
                          placeholder="Nome do esposo(a)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          value={memberToEdit.birthDate || ''}
                          onChange={(e) =>
                            setMemberToEdit({ ...memberToEdit, birthDate: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* DIA DA ENTRADA NA CONGREGAÇÃO & FORMA DE INGRESSO (Explicitly requested!) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                        <CalendarCheck className="w-4 h-4 text-blue-600" />
                        Dia da Entrada na Congregação *
                      </label>
                      <input
                        type="date"
                        required
                        value={memberToEdit.entryDate || ''}
                        onChange={(e) =>
                          setMemberToEdit({ ...memberToEdit, entryDate: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Data de recepção no rol de membros da ADMJEBOP Remígio
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1">
                        Forma de Ingresso / Recepção
                      </label>
                      <select
                        value={memberToEdit.entryType || 'Batismo nas Águas'}
                        onChange={(e) =>
                          setMemberToEdit({
                            ...memberToEdit,
                            entryType: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs sm:text-sm font-medium"
                      >
                        <option value="Batismo nas Águas">Batismo nas Águas</option>
                        <option value="Carta de Recomendação">Carta de Recomendação / Mudança</option>
                        <option value="Aclamação">Aclamação / Reconciliação</option>
                        <option value="Transferência">Transferência de Congregação</option>
                      </select>
                    </div>
                  </div>

                  {/* Status, Nascimento e Batismo */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                      <select
                        value={memberToEdit.status || 'Ativo'}
                        onChange={(e) =>
                          setMemberToEdit({
                            ...memberToEdit,
                            status: e.target.value as Member['status'],
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                        <option value="Em Transferência">Em Transferência</option>
                        <option value="Disciplinado">Disciplinado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Data de Batismo
                      </label>
                      <input
                        type="date"
                        value={memberToEdit.baptismDate || ''}
                        onChange={(e) =>
                          setMemberToEdit({ ...memberToEdit, baptismDate: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bairro</label>
                      <input
                        type="text"
                        value={memberToEdit.neighborhood || ''}
                        onChange={(e) =>
                          setMemberToEdit({ ...memberToEdit, neighborhood: e.target.value })
                        }
                        placeholder="Centro, Bela Vista..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Endereço Residencial
                    </label>
                    <input
                      type="text"
                      value={memberToEdit.address || ''}
                      onChange={(e) => setMemberToEdit({ ...memberToEdit, address: e.target.value })}
                      placeholder="Rua, número"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  {/* Observations */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Observações Ministeriais
                    </label>
                    <textarea
                      rows={2}
                      value={memberToEdit.observations || ''}
                      onChange={(e) =>
                        setMemberToEdit({ ...memberToEdit, observations: e.target.value })
                      }
                      placeholder="Informações adicionais..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>
                </div>

              {/* Modal Footer with Actions and Delete if editing */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {memberToEdit.id && members.some((m) => m.id === memberToEdit.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const found = members.find((m) => m.id === memberToEdit.id);
                      if (found) setMemberToDelete(found);
                    }}
                    className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Apagar Cadastro
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/20"
                  >
                    Salvar Cadastro
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-APP CONFIRMATION MODAL FOR DELETION (REPLACES BROKEN WINDOW.CONFIRM)   */}
      {/* ========================================================================= */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Confirmar Exclusão de Membro
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Tem certeza que deseja apagar o cadastro de{' '}
              <strong className="text-slate-900">{memberToDelete.name}</strong> ({memberToDelete.role}) do rol da congregação?
            </p>
            <p className="text-[11px] text-red-600 font-semibold mt-1">
              Esta ação removerá todos os registros e não poderá ser desfeita.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all"
              >
                Sim, Apagar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE MEMBER CREDENTIAL MODAL */}
      {printCredentialMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="font-bold text-sm text-slate-800">
                Carteirinha de Membro Oficial
              </span>
              <button
                onClick={() => setPrintCredentialMember(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Credential card mockup */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-[#00236f] to-[#00174b] text-white shadow-xl relative overflow-hidden border border-blue-400/30">
              <div className="flex items-center justify-between pb-2 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 p-0.5">
                    <img
                      src={branding.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest block text-blue-200">
                      {branding.churchName}
                    </span>
                    <span className="text-[9px] text-white/80 block">
                      {branding.congregation}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  MEMBRO OFICIAL
                </span>
              </div>

              <div className="flex items-center gap-3.5 my-3">
                <img
                  src={printCredentialMember.photo}
                  alt={printCredentialMember.name}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/50 shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-sm text-white truncate">
                    {printCredentialMember.name}
                  </h4>
                  <span className="text-xs font-semibold text-amber-300 block truncate">
                    {printCredentialMember.role}
                  </span>
                  <span className="text-[10px] text-blue-200 block mt-1">
                    Rol: {printCredentialMember.id.replace('mem-', 'ROL-00')}
                  </span>
                  <span className="text-[10px] text-blue-200 block">
                    Entrada: {printCredentialMember.entryDate}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[9px] text-blue-200">
                <span>Pastor: {branding.pastorPresidente}</span>
                <span>Validade: 2026/2027</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-[#00236f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-blue-900 transition-colors"
              >
                <Printer className="w-4 h-4" /> Imprimir Carteirinha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
