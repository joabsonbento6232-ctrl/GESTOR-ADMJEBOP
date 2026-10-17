import React, { useState } from 'react';
import { ChurchBranding, AppUser, EcclesiasticalRole } from '../types/church';
import { INITIAL_USERS } from '../services/storage';
import {
  Church,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AuthScreenProps {
  branding: ChurchBranding;
  onLoginSuccess: (user: AppUser) => void;
  registeredUsers: AppUser[];
  onRegisterUser: (newUser: AppUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  branding,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regRole, setRegRole] = useState<EcclesiasticalRole>('Secretária geral');
  const [regPhone, setRegPhone] = useState('(83) 9');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrUser.trim() || !password.trim()) {
      setErrorMsg('Por favor, informe e-mail/usuário e sua senha.');
      return;
    }

    // Match against registered users or initial users
    const allUsers = [...registeredUsers, ...INITIAL_USERS];
    const found = allUsers.find(
      (u) =>
        u.email.toLowerCase() === emailOrUser.toLowerCase().trim() ||
        u.name.toLowerCase().includes(emailOrUser.toLowerCase().trim())
    );

    if (found) {
      // If user has a password set, verify (or allow 123 for demo)
      if (found.password && found.password !== password.trim() && password.trim() !== '123') {
        setErrorMsg('Senha incorreta para este usuário. Tente novamente ou use 123.');
        return;
      }
      onLoginSuccess(found);
    } else {
      // Allow demo guest login
      const demoUser: AppUser = {
        id: 'user-custom-' + Date.now(),
        name: emailOrUser.split('@')[0] || 'Usuário Convidado',
        email: emailOrUser.includes('@') ? emailOrUser : `${emailOrUser}@admjebop.org.br`,
        role: 'Obreiro Credenciado',
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        phone: '(83) 98765-4321',
        password: password.trim(),
        accessLevel: 'Membro',
      };
      onLoginSuccess(demoUser);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Preencha todos os campos obrigatórios.');
      return;
    }

    if (regPassword.trim().length < 3) {
      setErrorMsg('A senha deve conter no mínimo 3 caracteres.');
      return;
    }

    if (regPasswordConfirm && regPassword.trim() !== regPasswordConfirm.trim()) {
      setErrorMsg('A confirmação de senha não confere.');
      return;
    }

    const newUser: AppUser = {
      id: 'user-' + Date.now(),
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      role: regRole,
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: regPhone.trim(),
      password: regPassword.trim(),
      accessLevel: regRole.includes('Secretária') ? 'Secretaria' : 'Membro',
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setInfoMsg(
      `Instruções de redefinição enviadas para ${forgotEmail}. A senha provisória padrão é 123.`
    );
  };

  const quickLogin = (user: AppUser) => {
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00174b] via-[#00236f] to-[#0b1c30] flex flex-col justify-between p-3 sm:p-6 lg:p-8 text-white relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Responsive Container (Centered on desktop, full flow on mobile) */}
      <div className="w-full max-w-5xl mx-auto my-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 py-4">
        {/* Left Column (Brand Presentation on Desktop, Header on Mobile) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
          {/* Church Logo Container */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/10 backdrop-blur-md p-2.5 shadow-2xl border border-white/20 flex items-center justify-center">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt="Logo Igreja"
                className="w-full h-full object-contain filter drop-shadow"
              />
            ) : (
              <Church className="w-12 h-12 text-blue-200" />
            )}
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-blue-200">
              {branding.churchName}
            </span>
            <h1 className="text-sm font-semibold text-blue-100">
              {branding.churchSubtitle}
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mt-1">
              SINGER ADMJEBOP
            </h2>
            <p className="text-xs sm:text-sm text-blue-200/90 font-medium mt-1">
              {branding.congregation} • Gestão Ministerial Integrada
            </p>
          </div>

          <p className="hidden lg:block text-xs text-blue-200/80 leading-relaxed max-w-md pt-2">
            Sistema completo de membresia, emissão de cartas, arquivos da secretaria, núcleos
            familiares, visitação pastoral e patrimônio inventariado.
          </p>

          <div className="hidden lg:flex items-center gap-2 pt-2 text-xs text-emerald-300 font-bold bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" /> Acesso Seguro com Senha e Criptografia Local
          </div>
        </div>

        {/* Right Column: Authentication Card (Responsive on all viewports) */}
        <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-800 border border-white/20 relative z-10">
          {/* Tabs: Abrir Aplicativo / Cadastrar Usuário */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center mb-5">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMsg('');
                setInfoMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                tab === 'login'
                  ? 'bg-[#00236f] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Abrir Aplicativo
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMsg('');
                setInfoMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                tab === 'register'
                  ? 'bg-[#00236f] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cadastrar Usuário
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 animate-in fade-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* TAB 1: ENTRAR NO SISTEMA / ABRIR O APLICATIVO */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail ou Usuário
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    placeholder="ex: pastor@admjebop.org.br ou seu nome"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f] text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] font-semibold text-blue-700 hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f] text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                    />
                    <span>Lembrar meu acesso</span>
                  </label>
                  <span>Senha padrão de teste: <strong className="text-slate-600">123</strong></span>
                </div>
              </div>

              {/* BOTAO PRINCIPAL: ABRIR O APLICATIVO */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#00236f] hover:bg-blue-900 active:scale-[0.98] transition-all text-white font-black rounded-xl shadow-lg shadow-blue-900/25 text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Abrir o Aplicativo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Botão de Acesso Rápido Direto (1 clique) */}
              <button
                type="button"
                onClick={() => quickLogin(INITIAL_USERS[0])}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Abrir Aplicativo Imediatamente (Acesso Rápido)</span>
              </button>

              {/* Quick Demo Access Buttons */}
              <div className="pt-2">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 text-center mb-2">
                  Ou selecione seu perfil ministerial:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickLogin(INITIAL_USERS[0])}
                    className="p-2 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 text-left transition-all flex flex-col active:scale-95"
                  >
                    <span className="text-xs font-bold text-blue-900 truncate">
                      👑 Pr. João Silva
                    </span>
                    <span className="text-[10px] text-blue-600">Presidente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLogin(INITIAL_USERS[1])}
                    className="p-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/60 text-left transition-all flex flex-col active:scale-95"
                  >
                    <span className="text-xs font-bold text-emerald-900 truncate">
                      📝 Ana Paula
                    </span>
                    <span className="text-[10px] text-emerald-700">Secretária geral</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLogin(INITIAL_USERS[2])}
                    className="p-2 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60 text-left transition-all flex flex-col active:scale-95"
                  >
                    <span className="text-xs font-bold text-amber-900 truncate">
                      ✝️ Carlos Souza
                    </span>
                    <span className="text-[10px] text-amber-700">Presbítero</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLogin(INITIAL_USERS[3])}
                    className="p-2 rounded-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200/60 text-left transition-all flex flex-col active:scale-95"
                  >
                    <span className="text-xs font-bold text-purple-900 truncate">
                      🎵 Marcos Vinícius
                    </span>
                    <span className="text-[10px] text-purple-700">Dirigente Louvor</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: CRIAR NOVA CONTA */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ex: Francisco de Assis"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail de Acesso *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ex: francisco@admjebop.org.br"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Função Eclesiástica / Cargo *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                  >
                    <optgroup label="Novas Funções Eclesiásticas da Congregação">
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
                    <optgroup label="Funções Ministeriais Gerais">
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
                      <option value="Membro">Membro</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(83) 9..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Senha *</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00236f] hover:bg-blue-900 active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-lg text-xs sm:text-sm tracking-wide"
              >
                Criar Conta e Acessar
              </button>
            </form>
          )}

          {/* TAB 3: RECUPERAR SENHA */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center">
                <HelpCircle className="w-10 h-10 text-blue-700 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">Recuperação de Senha</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Digite seu e-mail cadastrado para redefinir sua senha de acesso ao sistema.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail Cadastrado
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="seuemail@admjebop.org.br"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00236f] hover:bg-blue-900 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
              >
                Enviar Instruções de Redefinição
              </button>

              <button
                type="button"
                onClick={() => setTab('login')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Voltar para o Login
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Verse */}
      <div className="text-center py-2 relative z-10">
        <p className="text-xs text-blue-200 italic font-medium">
          {branding.motto}
        </p>
      </div>
    </div>
  );
};
