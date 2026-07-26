import React, { useState } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { useUI } from '../../context/UIContext';
import { useAudio } from '../../context/AudioContext';
import { easterEggService } from '../../services/easterEggService';
import { PenTool, Trophy } from 'lucide-react';

export const Header: React.FC = () => {
  const { showToast, setMatrixMode, openCommandPalette, openGuestbookForm, openAchievements, openPinModal } = useUI();
  const { isMuted, toggleMute, playClick } = useAudio();
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
      showToast('SECRET TRIGGER DETECTED', 'Authenticating Admin Access...');
      openPinModal();
    }
  };

  return (
    <header>
      <a className="brand" id="brand-logo" title="JALEELO Portfolio Operating System" onClick={handleLogoClick} href="#top">
        JALEEL<b>O</b> <span className="brand-badge">{SITE_CONFIG.version}</span>
      </a>

      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <button
          className="header-btn"
          onClick={() => {
            playClick();
            openAchievements();
          }}
          title="View Secret System Achievements"
          aria-label="View Secret System Achievements"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--orange)',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'DM Mono, monospace',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Trophy size={13} /> Badges
        </button>

        <button
          className="header-btn"
          onClick={() => {
            playClick();
            openGuestbookForm();
          }}
          title="Sign Operating Environment Guestbook"
          aria-label="Sign Operating Environment Guestbook"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff',
            padding: '4px 10px',
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
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'DM Mono, monospace',
            cursor: 'pointer'
          }}
        >
          ⌘K
        </button>

        <button
          className="header-btn"
          onClick={() => {
            toggleMute();
          }}
          title={isMuted ? 'Unmute Synthesizer Audio' : 'Mute Synthesizer Audio'}
          aria-label="Toggle Audio Mute"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: isMuted ? 'var(--text-dim)' : 'var(--accent)',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'DM Mono, monospace',
            cursor: 'pointer'
          }}
        >
          {isMuted ? '🔇 Muted' : '🔊 Sound On'}
        </button>

        <div className="meta">
          <span>{SITE_CONFIG.location}</span>
          <i className="pulse" aria-hidden="true"></i>
          <span>SYSTEM ACTIVE</span>
        </div>
      </div>
    </header>
  );
};
