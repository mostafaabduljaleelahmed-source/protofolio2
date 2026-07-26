import React, { useState } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { useUI } from '../../context/UIContext';
import { useAudio } from '../../context/AudioContext';
import { easterEggService } from '../../services/easterEggService';
import { PenTool, Trophy } from 'lucide-react';

export const Header: React.FC = () => {
  const { showToast, setMatrixMode, openCommandPalette, openGuestbookForm, openAchievements } = useUI();
  const { isMuted, toggleMute, playClick } = useAudio();
  const [logoClicks, setLogoClicks] = useState<number>(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playClick();
    const next = logoClicks + 1;
    if (next >= 5) {
      setLogoClicks(0);
      easterEggService.unlockAchievement('dev_mode');
      showToast('DEV MODE UNLOCKED', 'Diagnostics: 120 FPS Target | WebGL 2.0 | Memory: Clean');
      setMatrixMode(prev => !prev);
    } else {
      setLogoClicks(next);
      showToast('SYSTEM LOGO', `Click ${5 - next} more times for Dev Mode!`);
    }
  };

  return (
    <header>
      <a className="brand" id="brand-logo" title="Click 5 times for Dev Stats" onClick={handleLogoClick} href="#top">
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
