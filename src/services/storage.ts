import {
  Member,
  SecretaryAttachment,
  ChurchAsset,
  ChurchEvent,
  PastoralVisit,
  ChurchFamily,
  ChurchBranding,
  AppUser,
} from '../types/church';

// Default Logo SVG Data URI (Bible with rays & dove style)
export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#00236f" />
  <path d="M50 15 L50 35 M36 25 L64 25" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  <path d="M22 68 C 34 58, 46 62, 50 67 C 54 62, 66 58, 78 68 L 78 46 C 66 36, 54 40, 50 45 C 46 40, 34 36, 22 46 Z" fill="#ffffff" fill-opacity="0.95" stroke="#dbe1ff" stroke-width="2"/>
  <line x1="50" y1="45" x2="50" y2="67" stroke="#00236f" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M50 30 Q 55 36 62 38 Q 54 41 50 48 Q 46 41 38 38 Q 45 36 50 30" fill="#fbbf24"/>
</svg>
`)}`;

export const DEFAULT_FACADE_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0McZEtYDI7O9ygjtJmqSHQqxBCq80yDizvP5d3iTvg6bkdMEEDA-lldz3ZgIWaY0n0vq4o0OiOBzRGXI9TTiOTyQEwUC_3_tBSiP4IHrlFeFTQNFopCx97pdwF6_UWV8okQ6xCYAaeayRDouqu-u8Koiytq2tzvbVX-EqTPhuaLik1X8sUCsPPepn6j0HrcGX0l99biThRNHPfMrwLG199Txel_TJPk_OYquTozids52hcl8rdIWd0Q';

export const INITIAL_BRANDING: ChurchBranding = {
  churchName: 'ASSEMBLEIA DE DEUS',
  churchSubtitle: 'Ministério Jesus o Bom Pastor',
  congregation: 'Congregação de Remígio-PB',
  motto: '“Até aqui nos ajudou o Senhor.” — 1 Samuel 7:12',
  address: 'Rua Principal, Centro - Remígio - PB',
  phone: '(83) 98765-4321',
  pastorPresidente: 'Pr. João da Silva Santos',
  logoUrl: DEFAULT_LOGO_SVG,
  facadeBannerUrl: DEFAULT_FACADE_IMG,
  bannerTitle: 'A Paz do Senhor Jesus!',
  bannerSubtitle: 'Gestão Ministerial Integrada - Remígio-PB',
  primaryColor: '#00236f',
};

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'user-1',
    name: 'Pr. João Silva',
    email: 'pastor@admjebop.org.br',
    role: 'Pastor Presidente',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '(83) 98765-4321',
    password: '123',
    accessLevel: 'Administrador',
    isPastor: true,
  },
  {
    id: 'user-2',
    name: 'Ana Paula Souza',
    email: 'secretaria@admjebop.org.br',
    role: 'Secretária geral',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '(83) 99654-3210',
    password: '123',
    accessLevel: 'Secretaria',
  },
  {
    id: 'user-3',
    name: 'Carlos Souza',
    email: 'presbitero@admjebop.org.br',
    role: 'Presbítero',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '(83) 98876-2310',
    password: '123',
    accessLevel: 'Pastor / Diretoria',
  },
  {
    id: 'user-4',
    name: 'Marcos Vinícius',
    email: 'louvor@admjebop.org.br',
    role: 'Dirigente ministério de louvor',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPph8294MXAvjhw0GGtkTvHqPIGgfUEGFf1s-Y2Cgl5TyE_kHRTShen6KoqyT7GmWyOWMlPAXqora416lbMd-u0i6036aP8PHLali5YvplVUk4IVr5_cyn1WGUWMdtOMjjexlkQDYKV9S7cKjq6DCCasWWw79AWuJutUXzrFbgb2nUj4-iPaa3fxu5wAEKnYxxUC0vuUl8KN33ARqwa_SVn73nLEpJK7mvUOiRY8QtQCxekH9TpKR26g',
    phone: '(83) 99123-4567',
    password: '123',
    accessLevel: 'Líder de Ministério',
  },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    name: 'João da Silva Santos',
    role: 'Pastor',
    status: 'Ativo',
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phone: '(83) 98765-4321',
    email: 'joao.silva@admjebop.org.br',
    birthDate: '1975-04-12',
    baptismDate: '1992-06-20',
    entryDate: '2010-01-15',
    address: 'Rua Bela Vista, 140',
    neighborhood: 'Bela Vista',
    city: 'Remígio - PB',
    maritalStatus: 'Casado(a)',
    spouseName: 'Ester Santos',
    familyId: 'fam-1',
    familyName: 'Família Silva Santos',
    observations: 'Pastor Titular e Presidente do Campo de Remígio.',
    directPastor: 'Mesa Diretora Estadual',
  },
  {
    id: 'mem-2',
    name: 'Ana Paula Souza',
    role: 'Secretária geral',
    status: 'Ativo',
    photo:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phone: '(83) 99654-3210',
    email: 'ana.secretaria@admjebop.org.br',
    birthDate: '1988-05-15',
    baptismDate: '2005-08-14',
    entryDate: '2015-02-10',
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'Remígio - PB',
    maritalStatus: 'Casado(a)',
    spouseName: 'Carlos Souza',
    familyId: 'fam-2',
    familyName: 'Família Souza',
    observations: 'Comprometida com a secretaria e documentação da igreja.',
    directPastor: 'Pr. João da Silva Santos',
  },
  {
    id: 'mem-3',
    name: 'Maria José de Oliveira',
    role: 'Dirigente Vaso de Unção (Círculo de Oração)',
    status: 'Ativo',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDBQNDpVqRogzgP13BLqaPxQATQuOQHZvMDdsCdiBHF7I8uHC-1eLT14l3qrztJCr0aPDCmW66Jn_NCowaAOjiWywCqVZPMHty48JEvtWRtv8b6DBCzVuGEtXGniWPgr9_k57dtaPNlQLDYWfnLKj9buHXwZH-641P3agKEQNJ0-n2feDjoBH7t4S4fj5_NKs5XIOp-z-eZzsVhUq6XWqZWQ83uJK7pmcu6c3jafX0rSP2i3H2Tafl1kg',
    phone: '(83) 98765-1234',
    email: 'mariajose@admjebop.org.br',
    birthDate: '1968-10-17',
    baptismDate: '1984-11-20',
    entryDate: '2012-03-05',
    address: 'Travessa da Paz, 45',
    neighborhood: 'Frei Damião',
    city: 'Remígio - PB',
    maritalStatus: 'Casado(a)',
    spouseName: 'Severino Oliveira',
    familyId: 'fam-3',
    familyName: 'Família Oliveira',
    observations: 'Coordena as reuniões do Círculo de Oração Vaso de Unção toda terça-feira.',
    directPastor: 'Pr. João da Silva Santos',
  },
  {
    id: 'mem-4',
    name: 'Lucas Gabriel Albuquerque',
    role: 'Dirigente Apocalipse (Juventude)',
    status: 'Ativo',
    photo:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    phone: '(83) 99345-6789',
    email: 'lucas.juventude@admjebop.org.br',
    birthDate: '1998-09-22',
    baptismDate: '2014-04-18',
    entryDate: '2018-05-20',
    address: 'Rua São José, 78',
    neighborhood: 'Centro',
    city: 'Remígio - PB',
    maritalStatus: 'Solteiro(a)',
    familyId: 'fam-4',
    familyName: 'Família Albuquerque',
    observations: 'Liderança ativa com os jovens e adolescentes do Ministério Apocalipse.',
    directPastor: 'Pr. João da Silva Santos',
  },
  {
    id: 'mem-5',
    name: 'José Carlos Ferreira',
    role: 'Dirigente Gideão (Grupo de Varões)',
    status: 'Ativo',
    photo:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    phone: '(83) 99876-5432',
    email: 'carlos.ferreira@admjebop.org.br',
    birthDate: '1970-07-08',
    baptismDate: '1990-12-10',
    entryDate: '2011-09-15',
    address: 'Av. Brasil, 210',
    neighborhood: 'Novo Horizonte',
    city: 'Remígio - PB',
    maritalStatus: 'Casado(a)',
    spouseName: 'Clara Ferreira',
    familyId: 'fam-5',
    familyName: 'Família Ferreira',
    observations: 'Diácono e dirigente dedicado do Grupo de Varões Gideão.',
    directPastor: 'Pr. João da Silva Santos',
  },
  {
    id: 'mem-6',
    name: 'Marcos Vinícius Barbosa',
    role: 'Dirigente ministério de louvor',
    status: 'Ativo',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPph8294MXAvjhw0GGtkTvHqPIGgfUEGFf1s-Y2Cgl5TyE_kHRTShen6KoqyT7GmWyOWMlPAXqora416lbMd-u0i6036aP8PHLali5YvplVUk4IVr5_cyn1WGUWMdtOMjjexlkQDYKV9S7cKjq6DCCasWWw79AWuJutUXzrFbgb2nUj4-iPaa3fxu5wAEKnYxxUC0vuUl8KN33ARqwa_SVn73nLEpJK7mvUOiRY8QtQCxekH9TpKR26g',
    phone: '(83) 99123-4567',
    email: 'marcos.louvor@admjebop.org.br',
    birthDate: '1994-10-19',
    baptismDate: '2010-02-14',
    entryDate: '2016-04-10',
    address: 'Rua do Comércio, 99',
    neighborhood: 'Centro',
    city: 'Remígio - PB',
    maritalStatus: 'Casado(a)',
    spouseName: 'Camila Barbosa',
    familyId: 'fam-6',
    familyName: 'Família Barbosa',
    observations: 'Evangelista e coordenador de todos os grupos musicais e sonoplastia.',
    directPastor: 'Pr. João da Silva Santos',
  },
  {
    id: 'mem-7',
    name: 'Fernanda Costa Lima',
    role: 'Dirigente shalon adonai (Grupo de Louvor)',
    status: 'Ativo',
    photo:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: '(83) 98876-2310',
    email: 'fernanda.shalon@admjebop.org.br',
    birthDate: '1992-03-27',
    baptismDate: '2008-05-12',
    entryDate: '2017-08-01',
    address: 'Rua Projetada, 33',
    neighborhood: 'Bela Vista',
    city: 'Remígio - PB',
    maritalStatus: 'Solteiro(a)',
    observations: 'Dirigente do Grupo de Louvor Shalon Adonai.',
    directPastor: 'Pr. João da Silva Santos',
  },
  {
    id: 'mem-8',
    name: 'Antônio Lima dos Santos',
    role: 'Dirigente secretaria de Missões',
    status: 'Ativo',
    photo:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    phone: '(83) 99812-8877',
    email: 'antonio.missoes@admjebop.org.br',
    birthDate: '1973-12-04',
    baptismDate: '1995-07-20',
    entryDate: '2013-05-18',
    address: 'Rua Santo Antônio, 102',
    neighborhood: 'Frei Damião',
    city: 'Remígio - PB',
    maritalStatus: 'Casado(a)',
    spouseName: 'Marta Regina',
    familyId: 'fam-7',
    familyName: 'Família Santos Lima',
    observations: 'Coordena o envio de recursos missionários para o Sertão e África.',
    directPastor: 'Pr. João da Silva Santos',
  },
  {
    id: 'mem-9',
    name: 'Marta Regina dos Santos',
    role: 'Secretária de Missões',
    status: 'Ativo',
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    phone: '(83) 99812-8878',
    email: 'marta.missoes@admjebop.org.br',
    birthDate: '1976-08-19',
    baptismDate: '1996-03-10',
    entryDate: '2013-05-18',
    address: 'Rua Santo Antônio, 102',
    neighborhood: 'Frei Damião',
    city: 'Remígio - PB',
    maritalStatus: 'Casado(a)',
    spouseName: 'Antônio Lima dos Santos',
    familyId: 'fam-7',
    familyName: 'Família Santos Lima',
    observations: 'Responsável pelas cartas e relatórios da Secretaria de Missões.',
    directPastor: 'Pr. João da Silva Santos',
  },
  {
    id: 'mem-10',
    name: 'Carlos Alberto Souza',
    role: 'Dirigente de casais (Ministério da Família)',
    status: 'Ativo',
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phone: '(83) 98844-3322',
    email: 'carlos.casais@admjebop.org.br',
    birthDate: '1984-11-30',
    baptismDate: '2002-09-15',
    entryDate: '2015-02-10',
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'Remígio - PB',
    maritalStatus: 'Casado(a)',
    spouseName: 'Ana Paula Souza',
    familyId: 'fam-2',
    familyName: 'Família Souza',
    observations: 'Presbítero e Dirigente de Casais junto com a esposa Ana Paula.',
    directPastor: 'Pr. João da Silva Santos',
  },
];

export const INITIAL_SECRETARY_ATTACHMENTS: SecretaryAttachment[] = [
  {
    id: 'sec-doc-1',
    title: 'Ata da Assembleia Geral Ordinária de Posse Ministerial',
    category: 'Atas e Termos',
    fileName: 'Ata_Assembleia_Geral_Remigio_2025.pdf',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadDate: '2025-01-20',
    author: 'Ana Paula Souza (Secretária geral)',
    description: 'Ata devidamente assinada com a composição da diretoria e conselho fiscal.',
  },
  {
    id: 'sec-doc-2',
    title: 'Escritura Pública do Imóvel do Templo Sede',
    category: 'Documentação do Imóvel',
    fileName: 'Escritura_Templo_Sede_Remigio_Cartorio.pdf',
    fileType: 'pdf',
    fileSize: '3.4 MB',
    uploadDate: '2024-06-15',
    author: 'Pr. João da Silva Santos',
    description: 'Certidão de inteiro teor e matrícula registrada no Cartório de Imóveis de Remígio-PB.',
  },
  {
    id: 'sec-doc-3',
    title: 'Estatuto Social e Regimento Interno ADMJEBOP Consolidado',
    category: 'Estatuto e Regimento',
    fileName: 'Estatuto_Social_ADMJEBOP_Atualizado.docx',
    fileType: 'docx',
    fileSize: '840 KB',
    uploadDate: '2024-11-10',
    author: 'Mesa Diretora',
    description: 'Versão consolidada com regimento interno de congregações e departamentos.',
  },
  {
    id: 'sec-doc-4',
    title: 'Relatório Financeiro & Balancete Trimestral - 3º Trimestre',
    category: 'Relatórios Financeiros',
    fileName: 'Balancete_Financeiro_3T_Remigio.xlsx',
    fileType: 'xlsx',
    fileSize: '620 KB',
    uploadDate: '2025-09-30',
    author: 'Tesouraria Geral',
    description: 'Demonstrativo de entradas, dízimos, ofertas e despesas de manutenção.',
  },
  {
    id: 'sec-doc-5',
    title: 'Certidão de Batismo nas Águas - Acervo Geral',
    category: 'Certidões e Cartas',
    fileName: 'Certidao_Batismo_Oficial_ADMJEBOP.pdf',
    fileType: 'pdf',
    fileSize: '410 KB',
    uploadDate: '2025-08-25',
    author: 'Secretaria Geral',
    description: 'Cópia arquivada do lote de batismo realizado no Rio Paraíba.',
    isOfficialCopy: true,
  },
];

export const INITIAL_ASSETS: ChurchAsset[] = [
  {
    id: 'asset-1',
    name: 'Imóvel Templo Sede Remígio',
    category: 'Imóveis',
    quantity: 1,
    value: 300000,
    acquisitionDate: '2010-03-10',
    condition: 'Excelente',
    location: 'Centro - Remígio',
    notes: 'Imóvel próprio com nave para 350 pessoas, gabinete pastoral e 3 salas de EBD.',
  },
  {
    id: 'asset-2',
    name: 'Mesa de Som Digital Yamaha TF3 32 Canais',
    category: 'Eletrônicos e Som',
    quantity: 1,
    value: 14500,
    acquisitionDate: '2023-05-18',
    condition: 'Excelente',
    location: 'Cabine de Som - Templo Sede',
  },
  {
    id: 'asset-3',
    name: 'Cadeiras Estofadas para Nave Principal',
    category: 'Móveis e Utensílios',
    quantity: 220,
    value: 22000,
    acquisitionDate: '2022-11-20',
    condition: 'Bom',
    location: 'Nave do Templo',
  },
  {
    id: 'asset-4',
    name: 'Notebook Dell Inspiron da Secretaria Geral',
    category: 'Eletrônicos e Som',
    quantity: 1,
    value: 4200,
    acquisitionDate: '2023-01-10',
    condition: 'Excelente',
    location: 'Secretaria',
  },
  {
    id: 'asset-5',
    name: 'Bateria Nagano Concert + Pratos Orion',
    category: 'Instrumentos Musicais',
    quantity: 1,
    value: 7950,
    acquisitionDate: '2023-08-14',
    condition: 'Bom',
    location: 'Altar / Louvor',
  },
];

export const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: 'evt-1',
    title: 'Culto de Doutrina Bíblica',
    category: 'Culto de Doutrina',
    date: '2026-10-18',
    time: '19:30',
    location: 'Templo Sede',
    responsible: 'Pr. João da Silva Santos',
    description: 'Estudo sistemático da epístola aos Efésios.',
  },
  {
    id: 'evt-2',
    title: 'Reunião do Círculo de Oração Vaso de Unção',
    category: 'Círculo de Oração',
    date: '2026-10-20',
    time: '14:30',
    location: 'Templo Sede',
    responsible: 'Diaconisa Maria José',
    description: 'Tarde de clamor pelas famílias, enfermos e missionários.',
  },
  {
    id: 'evt-3',
    title: 'Culto Geral da Juventude Apocalipse',
    category: 'Juventude',
    date: '2026-10-24',
    time: '19:00',
    location: 'Templo Sede',
    responsible: 'Lucas Gabriel Albuquerque',
    description: 'Louvor, adoração e pregação com participação do Grupo Shalon Adonai.',
  },
  {
    id: 'evt-4',
    title: 'Reunião Mensal de Obreiros e Líderes',
    category: 'Reunião de Obreiros',
    date: '2026-10-25',
    time: '14:00',
    location: 'Sala de Conferências',
    responsible: 'Pr. Presidente e Mesa Diretora',
    description: 'Alinhamento ministerial de todos os dirigentes e secretarias.',
  },
];

export const INITIAL_VISITS: PastoralVisit[] = [
  {
    id: 'vis-1',
    memberName: 'Irmã Francisca das Chagas',
    phone: '(83) 98777-1122',
    address: 'Rua Alto do Cruzeiro, 40',
    neighborhood: 'Bela Vista',
    urgency: 'Urgente',
    reason: 'Saúde',
    status: 'Pendente',
    scheduledDate: '2026-10-18 16:30',
    notes: 'Recuperando-se de procedimento cirúrgico, solicitou visita e oração do Pastor.',
  },
  {
    id: 'vis-2',
    memberName: 'Família Ferreira',
    phone: '(83) 99876-5432',
    address: 'Av. Brasil, 210',
    neighborhood: 'Novo Horizonte',
    urgency: 'Normal',
    reason: 'Acolhimento',
    status: 'Pendente',
    scheduledDate: '2026-10-21 19:00',
    notes: 'Visita pastoral para orar pelo novo empreendimento da família.',
  },
  {
    id: 'vis-3',
    memberName: 'Irmão Manoel Ribeiro',
    phone: '(83) 98654-9988',
    address: 'Sítio Gravatá, Zona Rural',
    neighborhood: 'Zona Rural',
    urgency: 'Alta',
    reason: 'Espiritual',
    status: 'Confirmada',
    scheduledDate: '2026-10-22 15:00',
    notes: 'Idoso que não tem conseguido comparecer aos cultos presenciais.',
  },
];

export const INITIAL_FAMILIES: ChurchFamily[] = [
  {
    id: 'fam-1',
    name: 'Família Silva Santos',
    address: 'Rua Bela Vista, 140',
    neighborhood: 'Bela Vista',
    phone: '(83) 98765-4321',
    headName: 'Pr. João da Silva Santos',
    headMemberId: 'mem-1',
    membersCount: 4,
    memberNames: ['João da Silva Santos', 'Ester Santos', 'Davi Santos', 'Rebeca Santos'],
  },
  {
    id: 'fam-2',
    name: 'Família Souza',
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    phone: '(83) 99654-3210',
    headName: 'Carlos Alberto Souza',
    headMemberId: 'mem-10',
    membersCount: 3,
    memberNames: ['Carlos Alberto Souza', 'Ana Paula Souza', 'Gabriel Souza'],
  },
  {
    id: 'fam-3',
    name: 'Família Oliveira',
    address: 'Travessa da Paz, 45',
    neighborhood: 'Frei Damião',
    phone: '(83) 98765-1234',
    headName: 'Severino Oliveira',
    membersCount: 3,
    memberNames: ['Maria José de Oliveira', 'Severino Oliveira', 'Mateus Oliveira'],
  },
];

// Helper functions for LocalStorage persistence
const STORAGE_PREFIX = 'admjebop_crm_';

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage for key:', key, err);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving localStorage for key:', key, err);
  }
}

// Clean phone and build direct WhatsApp link
export function getWhatsAppLink(phone: string, customText?: string): string {
  const digits = phone.replace(/\D/g, '');
  // Format to Brazilian number with country code 55
  const fullNumber = digits.startsWith('55') ? digits : `55${digits}`;
  const defaultText = customText || 'A Paz do Senhor Jesus! Entramos em contato da Assembleia de Deus ADMJEBOP Remígio-PB.';
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(defaultText)}`;
}

// Format file size
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
