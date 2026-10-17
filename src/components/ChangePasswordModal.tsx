import React, { useState } from 'react';
import { AppUser } from '../types/church';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onSavePassword: (newPassword: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSavePassword,
}) => {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPwd.trim()) {
      setErrorMsg('Informe a nova senha.');
      return;
    }

    if (newPwd.length < 3) {
      setErrorMsg('A nova senha deve possuir no mínimo 3 caracteres.');
      return;
    }

    if (newPwd !== confirmPwd) {
      setErrorMsg('A confirmação de senha não confere com a nova senha.');
      return;
    }

    onSavePassword(newPwd.trim());
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-4 bg-[#00236f] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-200" />
            <span className="font-bold text-sm sm:text-base">Alterar Minha Senha de Acesso</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-blue-100 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-blue-800 block truncate">{currentUser.email}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Senha alterada com sucesso!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nova Senha de Acesso *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Digite a nova senha..."
                className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirmar Nova Senha *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Repita a nova senha..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00236f] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all"
            >
              Salvar Nova Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
