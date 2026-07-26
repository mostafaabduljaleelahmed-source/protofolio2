import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useAudio } from '../../context/AudioContext';
import { easterEggService } from '../../services/easterEggService';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    toggleCommandPalette,
    showToast,
    toggleAIChat,
    openGuestbookForm,
    openAdminPanel,
    openAchievements,
    setMatrixMode
  } = useUI();
  const { playClick, playCrystal, playTheme } = useAudio();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      easterEggService.unlockAchievement('cmd_k');
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + A -> Open Hidden Admin Control Center
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdminPanel();
        showToast('HIDDEN CONTROL CENTER', 'Admin Panel Initialized.');
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        closeCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, closeCommandPalette, toggleCommandPalette, openAdminPanel, showToast]);

  const handleCommandSelect = (cmd: string) => {
    closeCommandPalette();
    playClick();
    switch (cmd) {
      case 'achievements':
        openAchievements();
        break;
      case 'night-mode':
        easterEggService.toggleNightMode();
        break;
      case 'hero-lighting':
        playTheme();
        window.dispatchEvent(new CustomEvent('discover-architect'));
        showToast('LIGHTING CYCLED', '3D Scene Volumetric Lighting Theme Updated.');
        break;
      case 'admin-panel':
        openAdminPanel();
        break;
      case 'guestbook':
        openGuestbookForm();
        break;
      case 'matrix':
        setMatrixMode(prev => !prev);
        easterEggService.unlockAchievement('matrix');
        showToast('COMMAND EXECUTED', 'Matrix Rain Toggled!');
        break;
      case 'quote':
        playCrystal();
        showToast('ENGINEERING WISDOM', '"First, solve the problem. Then, write the code." — John Johnson');
        break;
      case 'ai':
        toggleAIChat();
        showToast('AI ASSISTANT', 'Interactive AI Interface Activated.');
        break;
      case 'contact':
        window.location.hash = '#contact';
        break;
      default:
        break;
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="active"
      id="cmdk-modal"
      onClick={closeCommandPalette}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div className="cmdk-box" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          className="cmdk-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type a command (e.g. achievements, night-mode, hero-lighting, admin, matrix)..."
          autoFocus
          aria-label="Command search input"
        />
        <div className="cmdk-list">
          <div className="cmdk-item" onClick={() => handleCommandSelect('achievements')}>
            <span>&gt; View Secret System Achievements</span>
            <code>Trophy</code>
          </div>
          <div className="cmdk-item" onClick={() => handleCommandSelect('night-mode')}>
            <span>&gt; Toggle Midnight Stealth Night Mode</span>
            <code>Stealth</code>
          </div>
          <div className="cmdk-item" onClick={() => handleCommandSelect('hero-lighting')}>
            <span>&gt; Cycle 3D Volumetric Lighting Theme</span>
            <code>3D Scene</code>
          </div>
          <div className="cmdk-item" onClick={() => handleCommandSelect('admin-panel')}>
            <span>&gt; Open Hidden Admin Control Center (Ctrl+Shift+A)</span>
            <code>Secret</code>
          </div>
          <div className="cmdk-item" onClick={() => handleCommandSelect('guestbook')}>
            <span>&gt; Sign Operating Environment Guestbook</span>
            <code>Community</code>
          </div>
          <div className="cmdk-item" onClick={() => handleCommandSelect('matrix')}>
            <span>&gt; Toggle Matrix Digital Rain</span>
            <code>Easter Egg</code>
          </div>
          <div className="cmdk-item" onClick={() => handleCommandSelect('ai')}>
            <span>&gt; Ask Jaleelo AI Assistant</span>
            <code>AI Agent</code>
          </div>
        </div>
      </div>
    </div>
  );
};
