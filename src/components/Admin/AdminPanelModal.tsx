import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useAudio } from '../../context/AudioContext';
import { adminAuthService } from '../../services/adminAuthService';
import { analyticsService } from '../../services/analyticsService';
import { guestbookService } from '../../services/guestbookService';
import { AdminAnalyticsSummary, GuestbookEntry } from '../../types';
import { GuestbookCard } from '../Guestbook/GuestbookCard';
import { Button } from '../common/Button';
import {
  ShieldAlert,
  KeyRound,
  Github,
  X,
  LayoutDashboard,
  MessageSquare,
  MousePointerClick,
  Sliders,
  LogOut,
  RefreshCw,
  Download,
  Bot,
  Palette
} from 'lucide-react';

export const AdminPanelModal: React.FC = () => {
  const { isAdminPanelOpen, closeAdminPanel, showToast, setMatrixMode } = useUI();
  const { playClick, playTheme } = useAudio();

  const [activeTab, setActiveTab] = useState<'overview' | 'guestbook' | 'heatmap' | 'settings'>('overview');
  const [passcode, setPasscode] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(adminAuthService.isAuthenticated());

  const [adminSummary, setAdminSummary] = useState<AdminAnalyticsSummary | null>(null);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeThemeHue, setActiveThemeHue] = useState<string>('#88d9ff');

  const loadAdminData = async () => {
    setLoading(true);
    const summaryData = await analyticsService.getAdminSummary();
    setAdminSummary(summaryData);

    const gbData = await guestbookService.fetchAllEntriesForAdmin();
    setGuestbookEntries(gbData);

    setLoading(false);
  };

  useEffect(() => {
    if (isAdminPanelOpen) {
      const auth = adminAuthService.isAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        loadAdminData();
      }
      const unsubscribe = guestbookService.subscribe(() => {
        if (adminAuthService.isAuthenticated()) {
          loadAdminData();
        }
      });
      return () => unsubscribe();
    }
  }, [isAdminPanelOpen]);

  if (!isAdminPanelOpen) return null;

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (adminAuthService.authenticateWithPasscode(passcode)) {
      setIsAuthenticated(true);
      showToast('ADMIN AUTHENTICATED', 'Control Center unlocked.');
      loadAdminData();
    } else {
      showToast('AUTH ERROR', 'Invalid admin passcode.');
    }
  };

  const handleGitHubOAuth = () => {
    playClick();
    showToast('OAUTH REDIRECT', 'Initiating GitHub Admin Authentication...');
    adminAuthService.loginWithGitHub();
  };

  const handleLogout = () => {
    playClick();
    adminAuthService.logout();
    setIsAuthenticated(false);
    showToast('ADMIN LOGOUT', 'Session terminated.');
    closeAdminPanel();
    if (window.history.pushState) {
      window.history.pushState(null, '', '/');
    }
  };

  const handleThemeChange = (color: string) => {
    playTheme();
    setActiveThemeHue(color);
    document.documentElement.style.setProperty('--theme-color', color);
    showToast('THEME UPDATED', `System lighting set to ${color}`);
  };

  const handleApproveGuestbook = async (id: string) => {
    await guestbookService.adminApproveEntry(id);
    showToast('ENTRY APPROVED', 'Published to public feed.');
    loadAdminData();
  };

  const handleDeleteGuestbook = async (id: string) => {
    await guestbookService.adminDeleteEntry(id);
    showToast('ENTRY DELETED', 'Guestbook entry deleted.');
    loadAdminData();
  };

  return (
    <div
      className="active"
      id="cmdk-modal"
      onClick={closeAdminPanel}
      role="dialog"
      aria-modal="true"
      aria-label="Hidden Admin Control Center"
    >
      <div
        className="cmdk-box admin-panel-box"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '920px',
          width: '92%',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '16px',
          background: 'rgba(8, 11, 18, 0.95)',
          border: '1px solid rgba(136, 217, 255, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(136, 217, 255, 0.1)',
          color: 'var(--text-main)'
        }}
      >
        {/* CONTROL CENTER HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={22} color="var(--orange)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Hidden Admin Control Center
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="End Admin Session"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
              >
                <LogOut size={15} /> Logout
              </button>
            )}
            <button
              onClick={closeAdminPanel}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* AUTHENTICATION SCREEN */
          <div style={{ padding: '1.5rem 0', maxWidth: '440px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <ShieldAlert size={40} style={{ margin: '0 auto 0.5rem auto', color: 'var(--orange)' }} />
              <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>Administrator Authentication</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sign in with GitHub OAuth or enter the system passcode to access moderation and control settings.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleGitHubOAuth}
              leftIcon={<Github size={16} />}
              style={{ width: '100%', marginBottom: '1.25rem', justifyContent: 'center' }}
            >
              Login with GitHub OAuth
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
              <span style={{ padding: '0 10px' }}>OR PASSCODE AUTH</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
            </div>

            <form onSubmit={handlePasscodeLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="password"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  placeholder="Admin passcode (Dev: jaleelo-admin-2026)"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <Button variant="secondary" type="submit" leftIcon={<KeyRound size={15} />} style={{ width: '100%', justifyContent: 'center' }}>
                Unlock Admin Mode
              </Button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED MULTI-TAB DASHBOARD */
          <div>
            {/* TABS HEADER */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
              <button
                className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                style={{
                  background: activeTab === 'overview' ? 'rgba(136, 217, 255, 0.15)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'overview' ? 'var(--accent)' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LayoutDashboard size={15} /> Overview & Telemetry
              </button>

              <button
                className={`admin-tab ${activeTab === 'guestbook' ? 'active' : ''}`}
                onClick={() => setActiveTab('guestbook')}
                style={{
                  background: activeTab === 'guestbook' ? 'rgba(136, 217, 255, 0.15)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'guestbook' ? 'var(--accent)' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MessageSquare size={15} /> Guestbook Moderation ({guestbookEntries.filter(e => !e.approved || e.status === 'pending').length})
              </button>

              <button
                className={`admin-tab ${activeTab === 'heatmap' ? 'active' : ''}`}
                onClick={() => setActiveTab('heatmap')}
                style={{
                  background: activeTab === 'heatmap' ? 'rgba(136, 217, 255, 0.15)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'heatmap' ? 'var(--accent)' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MousePointerClick size={15} /> Click Heatmap
              </button>

              <button
                className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
                style={{
                  background: activeTab === 'settings' ? 'rgba(136, 217, 255, 0.15)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'settings' ? 'var(--accent)' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sliders size={15} /> System Settings
              </button>

              <button
                onClick={loadAdminData}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                title="Refresh All Admin Feeds"
              >
                <RefreshCw size={15} className={loading ? 'spin' : ''} />
              </button>
            </div>

            {/* TAB CONTENT 1: OVERVIEW */}
            {activeTab === 'overview' && adminSummary && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Total Unique Visitors</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{adminSummary.totalVisitors}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Today's Live Visits</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)' }}>{adminSummary.todayVisitors}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <Download size={14} /> Resume Downloads
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{adminSummary.resumeDownloads}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <Bot size={14} /> AI Assistant Queries
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--orange)' }}>{adminSummary.aiQueriesCount}</div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: GUESTBOOK MODERATION */}
            {activeTab === 'guestbook' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--orange)', fontWeight: 700 }}>
                      Pending Approval: {guestbookEntries.filter(e => !e.approved || e.status === 'pending').length}
                    </span>
                    <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.2)' }}>|</span>
                    <span>
                      Approved Public: {guestbookEntries.filter(e => e.approved || e.status === 'approved').length}
                    </span>
                  </div>
                  <button
                    onClick={loadAdminData}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace' }}
                  >
                    <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh Sync
                  </button>
                </div>

                {guestbookEntries.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No guestbook entries found in database.</p>
                ) : (
                  guestbookEntries
                    .sort((a, b) => (!a.approved ? -1 : 1) - (!b.approved ? -1 : 1))
                    .map(entry => (
                      <GuestbookCard
                        key={entry.id}
                        entry={entry}
                        isAdmin={true}
                        onApprove={handleApproveGuestbook}
                        onDelete={handleDeleteGuestbook}
                      />
                    ))
                )}
              </div>
            )}

            {/* TAB CONTENT 3: CLICK HEATMAP */}
            {activeTab === 'heatmap' && adminSummary && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--accent)' }}>Most Clicked Buttons</h4>
                  {adminSummary.mostClickedButtons.map((b, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                      <span>{b.label}</span>
                      <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{b.count} clicks</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--orange)' }}>Top AI Assistant Queries</h4>
                  {adminSummary.aiQueryLogs.map((q, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                      <span>{q.query}</span>
                      <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--orange)' }}>{q.count} times</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: SYSTEM & THEME SETTINGS */}
            {activeTab === 'settings' && (
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Palette size={16} /> Live 3D Scene Lighting Color Palette
                </h4>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {['#88d9ff', '#e89a61', '#38ef7d', '#b967ff', '#ffffff'].map((color, i) => (
                    <button
                      key={i}
                      onClick={() => handleThemeChange(color)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: color,
                        border: activeThemeHue === color ? '3px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        boxShadow: `0 0 12px ${color}`
                      }}
                      title={`Switch to ${color}`}
                    />
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#ffffff' }}>Matrix Rain Default State</h4>
                  <Button variant="secondary" size="sm" onClick={() => setMatrixMode(prev => !prev)}>
                    Toggle Matrix Mode State
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
