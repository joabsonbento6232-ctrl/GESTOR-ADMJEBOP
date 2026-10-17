export type EcclesiasticalRole =
  // Novas Funções Eclesiásticas da Congregação solicitadas:
  | 'Dirigente Vaso de Unção (Círculo de Oração)'
  | 'Dirigente Apocalipse (Juventude)'
  | 'Dirigente Gideão (Grupo de Varões)'
  | 'Dirigente ministério de louvor'
  | 'Dirigente shalon adonai (Grupo de Louvor)'
  | 'Dirigente secretaria de Missões'
  | 'Secretária de Missões'
  | 'Secretária geral'
  | 'Dirigente de casais (Ministério da Família)'
  // Funções tradicionais e ministeriais:
  | 'Pastor'
  | 'Pastor Auxiliar'
  | 'Evangelista'
  | 'Presbítero'
  | 'Diácono'
  | 'Diaconisa'
  | 'Missionário(a)'
  | 'Cooperador(a)'
  | 'Auxiliar'
  | 'Líder de ministério'
  | 'Professor(a) EBD'
  | 'Secretária'
  | 'Membro sem cargo'
  | 'Membro'
  | string;

export interface Member {
  id: string;
  name: string;
  role: string;
  status: 'Ativo' | 'Inativo' | 'Em Transferência' | 'Disciplinado';
  photo: string;
  phone: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  baptismDate?: string;
  address: string;
  neighborhood: string;
  city: string;
  rg?: string;
  cpf?: string;
  maritalStatus: 'Solteiro(a)' | 'Casado(a)' | 'Viúvo(a)' | 'Divorciado(a)';
  spouseName?: string;
  entryDate: string; // Dia da entrada na congregação
  entryType?: 'Batismo nas Águas' | 'Carta de Recomendação' | 'Aclamação' | 'Transferência';
  familyId?: string;
  familyName?: string;
  department?: string;
  observations?: string;
  directPastor?: string;
  // Credenciais de Login e Senha para o cadastro do usuário
  hasSystemAccess?: boolean;
  loginEmail?: string;
  loginPassword?: string;
  accessLevel?: 'Administrador' | 'Pastor / Diretoria' | 'Secretaria' | 'Líder de Ministério' | 'Membro';
}

export type SecretaryCategory =
  | 'Atas e Termos'
  | 'Documentação do Imóvel'
  | 'Estatuto e Regimento'
  | 'Certidões e Cartas'
  | 'Relatórios Financeiros'
  | 'Outros Documentos';

export interface SecretaryAttachment {
  id: string;
  title: string;
  category: SecretaryCategory;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'image' | 'xlsx' | 'txt' | string;
  fileSize: string; // e.g., "1.4 MB"
  uploadDate: string; // YYYY-MM-DD
  author: string;
  description?: string;
  fileDataUrl?: string; // base64 or link
  isOfficialCopy?: boolean; // Se salvo automaticamente por emissão de carta
}

export interface ChurchAsset {
  id: string;
  name: string;
  category: 'Imóveis' | 'Eletrônicos e Som' | 'Móveis e Utensílios' | 'Instrumentos Musicais' | 'Veículos';
  quantity: number;
  value: number; // in BRL
  acquisitionDate: string;
  condition: 'Excelente' | 'Bom' | 'Regular' | 'Necessita Reparo';
  location: string;
  notes?: string;
  photoUrl?: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  category: 'Culto de Doutrina' | 'Culto Público' | 'Juventude' | 'Círculo de Oração' | 'Varões' | 'Missões' | 'Reunião de Obreiros' | 'EBD' | 'Outro';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  responsible: string;
  description: string;
}

export interface PastoralVisit {
  id: string;
  memberName: string;
  phone: string;
  address: string;
  neighborhood: string;
  urgency: 'Urgente' | 'Alta' | 'Normal';
  reason: 'Saúde' | 'Espiritual' | 'Acolhimento' | 'Casal' | 'Novo Convertido' | 'Outro';
  status: 'Pendente' | 'Confirmada' | 'Realizada';
  scheduledDate: string;
  notes?: string;
}

export interface ChurchFamily {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  phone: string;
  headName: string;
  headMemberId?: string;
  membersCount: number;
  memberNames: string[];
}

export interface ChurchBranding {
  churchName: string;
  churchSubtitle: string;
  congregation: string;
  motto: string;
  address: string;
  phone: string;
  pastorPresidente: string;
  logoUrl: string;
  facadeBannerUrl: string;
  bannerTitle: string;
  bannerSubtitle: string;
  primaryColor: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  phone: string;
  password?: string;
  isPastor?: boolean;
  accessLevel?: string;
  memberId?: string;
}

