import React, { useState } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { useUI } from '../../context/UIContext';
import { useAudio } from '../../context/AudioContext';
import { easterEggService } from '../../services/easterEggService';
import { PenTool, FileText, Terminal } from 'lucide-react';

export const Header: React.FC = () => {
  const { showToast, openCommandPalette, openGuestbookForm, openPinModal } = useUI();
  const { playClick } = useAudio();
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playClick();

    const now = Date.now();
    const recent = [...clickTimestamps, now].filter(t => now - t <= 3000);
    setClickTimestamps(recent);

    if (recent.length >= 5) {
      setClickTimestamps([]);
      easterEggService.unlockAchievement('dev_mode');
      showToast('ADMIN AUTHENTICATION', 'Prompting Pin Verification...');
      openPinModal();
    }
  };

  return (
    <header>
      <a className="brand" id="brand-logo" title="Mostafa Abduljaleel Portfolio" onClick={handleLogoClick} href="#top">
        MOSTAFA <b>ABDULJALEEL</b> <span className="brand-badge">{SITE_CONFIG.version}</span>
      </a>

      <nav className="header-nav" aria-label="Main Navigation" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <a href="#work" className="nav-link" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
          Projects
        </a>
        <a href="#philosophy" className="nav-link" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
          Philosophy
        </a>
        <a href="#contact" className="nav-link" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
          Contact
        </a>
      </nav>

      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <a
          href={SITE_CONFIG.github}
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
          title="View Resume Document"
          aria-label="Download Resume"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'DM Mono, monospace',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            textDecoration: 'none'
          }}
        >
          <FileText size={13} color="var(--accent)" /> Resume
        </a>

        <button
          className="header-btn"
          onClick={() => {
            playClick();
            openGuestbookForm();
          }}
          title="Sign Environment Guestbook"
          aria-label="Sign Guestbook"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-secondary)',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'DM Mono, monospace',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <PenTool size={13} /> Guestbook
        </button>

        <button
          className="header-btn"
          onClick={() => {
            playClick();
            openCommandPalette();
          }}
          title="Open Command Palette (Ctrl+K / Cmd+K)"
          aria-label="Open Command Palette"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-muted)',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'DM Mono, monospace',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Terminal size={12} /> ⌘K
        </button>
      </div>
    </header>
  );
};

