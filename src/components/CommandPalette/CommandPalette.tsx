import React, { useState, useEffect } from 'react';
import { toggleMatrixMode } from '../../utils/matrixRain';
import { audioEngine } from '../../utils/audioEngine';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandSelect = (cmd: string) => {
    setIsOpen(false);
    audioEngine.playClick();
    switch (cmd) {
      case 'matrix':
        toggleMatrixMode();
        if (window.showToast) window.showToast('COMMAND EXECUTED', 'Matrix Rain Engaged!');
        break;
      case 'quote':
        audioEngine.playCrystal();
        if (window.showToast) window.showToast('ENGINEERING WISDOM', '"First, solve the problem. Then, write the code." — John Johnson');
        break;
      case 'contact':
        window.location.hash = '#contact';
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`active`} id="cmdk-modal" onClick={() => setIsOpen(false)}>
      <div className="cmdk-box" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          className="cmdk-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type a command or search (e.g. stack, quote, matrix)..."
          autoFocus
        />
        <div className="cmdk-list">
          <div className="cmdk-item" onClick={() => handleCommandSelect('matrix')}>
            <span>&gt; Toggle Matrix Mode</span>
            <code>Easter Egg</code>
          </div>
          <div className="cmdk-item" onClick={() => handleCommandSelect('quote')}>
            <span>&gt; Random Engineering Wisdom</span>
            <code>Quote</code>
          </div>
          <div className="cmdk-item" onClick={() => handleCommandSelect('contact')}>
            <span>&gt; Jump to Contact</span>
            <code>Nav</code>
          </div>
        </div>
      </div>
    </div>
  );
};
