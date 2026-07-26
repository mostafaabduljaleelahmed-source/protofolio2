import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { guestbookService } from '../../services/guestbookService';
import { GuestbookEntry } from '../../types';
import { GuestbookCard } from './GuestbookCard';
import { ShieldAlert, KeyRound, X, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

export const GuestbookAdminModal: React.FC = () => {
  const { isGuestbookAdminOpen, closeGuestbookAdmin, showToast } = useUI();
  const [passcode, setPasscode] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'jaleelo-admin-2026' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      showToast('ADMIN AUTHENTICATED', 'Owner moderation mode unlocked.');
      loadEntries();
    } else {
      showToast('AUTHENTICATION FAILED', 'Invalid passcode.');
    }
  };

  const loadEntries = async () => {
    const data = await guestbookService.fetchAllEntriesForAdmin();
    setEntries(data);
  };

  useEffect(() => {
    if (isGuestbookAdminOpen && isAuthenticated) {
      loadEntries();
    }
  }, [isGuestbookAdminOpen, isAuthenticated]);

  if (!isGuestbookAdminOpen) return null;

  const handleApprove = async (id: string) => {
    await guestbookService.adminApproveEntry(id);
    showToast('ENTRY APPROVED', 'Published to public guestbook feed.');
    loadEntries();
  };

  const handleDelete = async (id: string) => {
    await guestbookService.adminDeleteEntry(id);
    showToast('ENTRY DELETED', 'Guestbook entry removed.');
    loadEntries();
  };

  const handleStartEdit = (id: string, currentContent: string) => {
    setEditingId(id);
    setEditText(currentContent);
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      await guestbookService.adminUpdateEntry(editingId, editText);
      showToast('ENTRY UPDATED', 'Guestbook entry content updated.');
      setEditingId(null);
      loadEntries();
    }
  };

  return (
    <div
      className="active"
      id="cmdk-modal"
      onClick={closeGuestbookAdmin}
      role="dialog"
      aria-modal="true"
      aria-label="Guestbook Admin Moderation"
    >
      <div
        className="cmdk-box guestbook-admin-box"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          width: '90%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '16px',
          background: 'rgba(8, 11, 18, 0.94)',
          border: '1px solid rgba(232, 154, 97, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          color: 'var(--text-main)'
        }}
      >
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--orange)', fontSize: '1.1rem', fontWeight: 700 }}>
            <ShieldAlert size={20} />
            <span>Guestbook Admin Moderation</span>
          </div>
          <button
            onClick={closeGuestbookAdmin}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {!isAuthenticated ? (
          /* PASSCODE FORM */
          <form onSubmit={handleLogin} style={{ padding: '1rem 0' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Enter Admin Access Key (Dev default: <code>jaleelo-admin-2026</code>)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="password"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  placeholder="Passcode..."
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff'
                  }}
                />
                <Button variant="primary" type="submit" leftIcon={<KeyRound size={15} />}>
                  Unlock
                </Button>
              </div>
            </div>
          </form>
        ) : (
          /* ADMIN MODERATION FEED */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Submissions: {entries.length} | Pending: {entries.filter(e => e.status === 'pending').length}
              </span>
              <button
                onClick={loadEntries}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
              >
                <RefreshCw size={13} /> Refresh List
              </button>
            </div>

            {/* EDITING DIALOG INLINE */}
            {editingId && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--accent)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--accent)' }}>Edit Entry Signature Content</h5>
                <textarea
                  rows={3}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>Cancel</button>
                  <Button variant="primary" size="sm" onClick={handleSaveEdit}>Save Edit</Button>
                </div>
              </div>
            )}

            {entries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No guestbook entries found.</p>
            ) : (
              entries.map(entry => (
                <GuestbookCard
                  key={entry.id}
                  entry={entry}
                  isAdmin={true}
                  onApprove={handleApprove}
                  onDelete={handleDelete}
                  onEdit={handleStartEdit}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
