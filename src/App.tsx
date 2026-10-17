import React, { useState, useEffect } from 'react';
import {
  Member,
  SecretaryAttachment,
  ChurchAsset,
  ChurchEvent,
  PastoralVisit,
  ChurchFamily,
  ChurchBranding,
  AppUser,
} from './types/church';
import {
  INITIAL_BRANDING,
  INITIAL_USERS,
  INITIAL_MEMBERS,
  INITIAL_SECRETARY_ATTACHMENTS,
  INITIAL_ASSETS,
  INITIAL_EVENTS,
  INITIAL_VISITS,
  INITIAL_FAMILIES,
  getStoredData,
  setStoredData,
} from './services/storage';

import { Header } from './components/Header';
import { DesktopSidebar } from './components/DesktopSidebar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { MembersModule } from './components/MembersModule';
import { SecretaryModule } from './components/SecretaryModule';
import { CustomizationModule } from './components/CustomizationModule';
import { FamiliesModule } from './components/FamiliesModule';
import { PatrimonyModule } from './components/PatrimonyModule';
import { AgendaModule } from './components/AgendaModule';
import { VisitationModule } from './components/VisitationModule';
import { UsersModule } from './components/UsersModule';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  // Persistent State
  const [branding, setBranding] = useState<ChurchBranding>(() =>
    getStoredData('branding', INITIAL_BRANDING)
  );

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() =>
    getStoredData('currentUser', INITIAL_USERS[0])
  );

  const [registeredUsers, setRegisteredUsers] = useState<AppUser[]>(() =>
    getStoredData('registeredUsers', INITIAL_USERS)
  );

  const [members, setMembers] = useState<Member[]>(() =>
    getStoredData('members', INITIAL_MEMBERS)
  );

  const [attachments, setAttachments] = useState<SecretaryAttachment[]>(() =>
    getStoredData('attachments', INITIAL_SECRETARY_ATTACHMENTS)
  );

  const [assets, setAssets] = useState<ChurchAsset[]>(() =>
    getStoredData('assets', INITIAL_ASSETS)
  );

  const [events, setEvents] = useState<ChurchEvent[]>(() =>
    getStoredData('events', INITIAL_EVENTS)
  );

  const [visits, setVisits] = useState<PastoralVisit[]>(() =>
    getStoredData('visits', INITIAL_VISITS)
  );

  const [families, setFamilies] = useState<ChurchFamily[]>(() =>
    getStoredData('families', INITIAL_FAMILIES)
  );

  // Active View / Navigation & Modals
  const [activeModule, setActiveModule] = useState<string>('painel');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    setStoredData('branding', branding);
  }, [branding]);

  useEffect(() => {
    setStoredData('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStoredData('registeredUsers', registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    setStoredData('members', members);
  }, [members]);

  useEffect(() => {
    setStoredData('attachments', attachments);
  }, [attachments]);

  useEffect(() => {
    setStoredData('assets', assets);
  }, [assets]);

  useEffect(() => {
    setStoredData('events', events);
  }, [events]);

  useEffect(() => {
    setStoredData('visits', visits);
  }, [visits]);

  useEffect(() => {
    setStoredData('families', families);
  }, [families]);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Handlers
  const handleSaveMember = (member: Member) => {
    setMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === member.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = member;
        return copy;
      }
      return [member, ...prev];
    });
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveAttachment = (attachment: SecretaryAttachment) => {
    setAttachments((prev) => {
      const idx = prev.findIndex((a) => a.id === attachment.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = attachment;
        return copy;
      }
      return [attachment, ...prev];
    });
  };

  const handleDeleteAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveAsset = (asset: ChurchAsset) => {
    setAssets((prev) => {
      const idx = prev.findIndex((a) => a.id === asset.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = asset;
        return copy;
      }
      return [asset, ...prev];
    });
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveEvent = (event: ChurchEvent) => {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === event.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = event;
        return copy;
      }
      return [event, ...prev];
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSaveVisit = (visit: PastoralVisit) => {
    setVisits((prev) => [visit, ...prev]);
  };

  const handleUpdateVisitStatus = (id: string, status: PastoralVisit['status']) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  const handleSaveFamily = (family: ChurchFamily) => {
    setFamilies((prev) => [family, ...prev]);
  };

  // User and Password Management Handlers
  const handleRegisterUser = (newUser: AppUser) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  const handleSaveUser = (user: AppUser) => {
    setRegisteredUsers((prev) => {
      const idx = prev.findIndex(
        (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = user;
        return copy;
      }
      return [...prev, user];
    });

    // If current logged-in user is updated
    if (currentUser && (currentUser.id === user.id || currentUser.email === user.email)) {
      setCurrentUser(user);
    }
  };

  const handleDeleteUser = (id: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSavePassword = (newPassword: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, password: newPassword };
    setCurrentUser(updatedUser);
    handleSaveUser(updatedUser);
  };

  // If user is on login screen or explicitly logged out
  if (!currentUser || activeModule === 'login') {
    return (
      <AuthScreen
        branding={branding}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveModule('painel');
        }}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  const pendingVisitsCount = visits.filter((v) => v.status === 'Pendente').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Fixed Header with Church Logo, Global Search & User Profile */}
      <Header
        branding={branding}
        currentUser={currentUser}
        onOpenSearch={() => setIsSearchOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          setActiveModule('login');
        }}
        onNavigate={(mod) => {
          setSelectedMemberId(null);
          setActiveModule(mod);
        }}
      />

      {/* Responsive Layout Shell: Desktop Sidebar (md:flex) + Main Content Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar for Tablets and Desktops */}
        <DesktopSidebar
          branding={branding}
          currentUser={currentUser}
          activeModule={activeModule}
          onNavigate={(mod) => {
            setSelectedMemberId(null);
            setActiveModule(mod);
          }}
          onLogout={() => {
            setCurrentUser(null);
            setActiveModule('login');
          }}
          onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
          membersCount={members.length}
          docsCount={attachments.length}
          pendingVisitsCount={pendingVisitsCount}
        />

        {/* Main module content area: responsive padding on mobile/tablet vs desktop */}
        <main className="flex-1 pt-20 pb-24 lg:pb-10 px-2 sm:px-4 lg:px-6 w-full min-w-0 overflow-x-hidden">
          {activeModule === 'painel' && (
            <Dashboard
              branding={branding}
              members={members}
              families={families}
              visits={visits}
              assets={assets}
              events={events}
              onNavigate={(mod) => {
                setSelectedMemberId(null);
                setActiveModule(mod);
              }}
              onSelectMember={(mem) => {
                setSelectedMemberId(mem.id);
                setActiveModule('membros');
              }}
              onUpdateBranding={setBranding}
            />
          )}

          {activeModule === 'membros' && (
            <MembersModule
              members={members}
              branding={branding}
              onSaveMember={handleSaveMember}
              onDeleteMember={handleDeleteMember}
              selectedMemberId={selectedMemberId}
              onClearSelectedMember={() => setSelectedMemberId(null)}
              onSaveUser={handleSaveUser}
              registeredUsers={registeredUsers}
            />
          )}

          {activeModule === 'secretaria' && (
            <SecretaryModule
              attachments={attachments}
              members={members}
              branding={branding}
              onSaveAttachment={handleSaveAttachment}
              onDeleteAttachment={handleDeleteAttachment}
            />
          )}

          {activeModule === 'customizacao' && (
            <CustomizationModule
              branding={branding}
              onUpdateBranding={setBranding}
            />
          )}

          {activeModule === 'familias' && (
            <FamiliesModule
              families={families}
              members={members}
              onSaveFamily={handleSaveFamily}
              onSelectMember={(mem) => {
                setSelectedMemberId(mem.id);
                setActiveModule('membros');
              }}
            />
          )}

          {activeModule === 'patrimonio' && (
            <PatrimonyModule
              assets={assets}
              onSaveAsset={handleSaveAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}

          {activeModule === 'agenda' && (
            <AgendaModule
              events={events}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeModule === 'visitacao' && (
            <VisitationModule
              visits={visits}
              onSaveVisit={handleSaveVisit}
              onUpdateStatus={handleUpdateVisitStatus}
            />
          )}

          {activeModule === 'usuarios' && (
            <UsersModule
              users={registeredUsers}
              currentUser={currentUser}
              branding={branding}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        members={members}
        events={events}
        documents={attachments}
        onSelectMember={(mem) => {
          setSelectedMemberId(mem.id);
          setActiveModule('membros');
        }}
        onSelectDocument={(doc) => {
          setActiveModule('secretaria');
        }}
        onSelectEvent={(evt) => {
          setActiveModule('agenda');
        }}
      />

      {/* Mobile/Compact Screen Bottom Navigation Bar (Hidden on lg and larger) */}
      <BottomNav
        activeModule={activeModule}
        onNavigate={(mod) => {
          setSelectedMemberId(null);
          setActiveModule(mod);
        }}
        onLogout={() => {
          setCurrentUser(null);
          setActiveModule('login');
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentUser={currentUser}
        onSavePassword={handleSavePassword}
      />
    </div>
  );
}
