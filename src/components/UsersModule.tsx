import React, { useState } from 'react';
import { AppUser, ChurchBranding, EcclesiasticalRole } from '../types/church';
import {
  KeyRound,
  UserPlus,
  Search,
  Shield,
  Trash2,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Mail,
  User,
  Phone,
  Briefcase,
  X,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface UsersModuleProps {
  users: AppUser[];
  currentUser: AppUser | null;
  branding: ChurchBranding;
  onSaveUser: (user: AppUser) => void;
  onDeleteUser: (id: string) => void;
}

export const UsersModule: React.FC<UsersModuleProps> = ({
  users,
  currentUser,
  branding,
  onSaveUser,
  onDeleteUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Partial<AppUser>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewUser = () => {
    setUserToEdit({
      id: 'user-' + Date.now(),
      name: '',
      email: '',
      role: 'Secretária geral',
      password: '123',
      accessLevel: 'Secretaria',
      phone: '(83) 9',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditUser = (user: AppUser) => {
    setUserToEdit({ ...user });
    setIsModalOpen(true);
  };

  const handleSaveUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit.name || !userToEdit.email) return;

    const finalUser: AppUser = {
      id: userToEdit.id || 'user-' + Date.now(),
      name: userToEdit.name.trim(),
      email: userToEdit.email.trim().toLowerCase(),
      role: userToEdit.role || 'Obreiro',
      password: userToEdit.password?.trim() || '123',
      accessLevel: userToEdit.accessLevel || 'Membro',
      phone: userToEdit.phone?.trim() || '(83) 98765-4321',
      avatarUrl:
        userToEdit.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isPastor: userToEdit.role?.toLowerCase().includes('pastor'),
    };

    onSaveUser(finalUser);
    setIsModalOpen(false);
    showToast(`Usuário ${finalUser.name} salvo com sucesso!`);
  };

  const handleExecuteDelete = () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser?.id) {
      alert('Você não pode excluir a sua própria conta conectada.');
      setUserToDelete(null);
      return;
    }

    const name = userToDelete.name;
    onDeleteUser(userToDelete.id);
    setUserToDelete(null);
    showToast(`O usuário "${name}" foi removido do sistema.`);
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

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-blue-700" /> Usuários & Acessos do Aplicativo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerenciamento de contas, e-mails de login, senhas e níveis de permissão do sistema
          </p>
        </div>

        <button
          onClick={handleOpenNewUser}
          className="px-4 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Novo Usuário com Senha
        </button>
      </div>

      {/* Info card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-blue-200 uppercase tracking-widest block">
            Segurança & Controle Eclesiástico
          </span>
          <h2 className="text-lg font-black mt-0.5">
            Controle de Login e Senha para Obreiros e Secretários
          </h2>
          <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
            Cada dirigente e secretário pode possuir sua conta de e-mail e senha para acessar o
            sistema da igreja pelo celular ou computador.
          </p>
        </div>
        <div className="bg-white/15 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-sm self-start sm:self-auto border border-white/10">
          {users.length} usuários autorizados
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, e-mail de login ou cargo..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredUsers.map((user) => {
          const isCurrent = user.id === currentUser?.id;
          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isCurrent ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{user.name}</h3>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
                            Você
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-blue-800 font-semibold block truncate">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-500">
                      Senha:{' '}
                      <strong className="text-slate-800">
                        {user.password ? user.password : '123 (padrão)'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-600">
                      Permissão: {user.accessLevel || 'Membro'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenEditUser(user)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar / Mudar Senha
                </button>

                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => setUserToDelete(user)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir Usuário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#00236f] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-200" />
                <span className="font-bold text-sm sm:text-base">
                  {userToEdit.id && users.some((u) => u.id === userToEdit.id)
                    ? 'Editar Login e Senha'
                    : 'Cadastrar Novo Usuário do App'}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserForm} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={userToEdit.name || ''}
                    onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
                    placeholder="ex: Pr. João Silva, Diác. Marcos..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail / Usuário de Login *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={userToEdit.email || ''}
                    onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
                    placeholder="ex: usuario@admjebop.org.br"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Senha de Acesso ao Aplicativo *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={userToEdit.password || ''}
                    onChange={(e) => setUserToEdit({ ...userToEdit, password: e.target.value })}
                    placeholder="Defina a senha do usuário"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-slate-400">
                    O usuário utilizará este e-mail e senha para entrar.
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setUserToEdit((prev) => ({
                        ...prev,
                        password: '123',
                      }))
                    }
                    className="text-[11px] font-bold text-blue-700 hover:underline"
                  >
                    Definir "123"
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    value={userToEdit.role || ''}
                    onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
                    placeholder="ex: Secretária geral, Pastor..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nível de Permissão
                  </label>
                  <select
                    value={userToEdit.accessLevel || 'Secretaria'}
                    onChange={(e) => setUserToEdit({ ...userToEdit, accessLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  >
                    <option value="Administrador">Administrador Geral</option>
                    <option value="Pastor / Diretoria">Pastor / Diretoria</option>
                    <option value="Secretaria">Secretaria Geral</option>
                    <option value="Líder de Ministério">Líder de Ministério</option>
                    <option value="Membro">Membro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp para Contato
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userToEdit.phone || ''}
                    onChange={(e) => setUserToEdit({ ...userToEdit, phone: e.target.value })}
                    placeholder="(83) 98765-4321"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/20"
                >
                  Salvar Usuário & Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR USER DELETION */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Confirmar Exclusão de Acesso
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Deseja realmente revogar e apagar a conta de acesso de{' '}
              <strong className="text-slate-900">"{userToDelete.name}"</strong> ({userToDelete.email})?
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all"
              >
                Sim, Apagar Acesso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
