import React, { useState } from 'react';
import { toggleMatrixMode } from '../../utils/matrixRain';
import { SITE_CONFIG } from '../../config/siteConfig';

export const Header: React.FC = () => {
  const [logoClicks, setLogoClicks] = useState<number>(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = logoClicks + 1;
    if (next >= 5) {
      setLogoClicks(0);
      if (window.showToast) {
        window.showToast('DEV MODE UNLOCKED', 'Diagnostics: 120 FPS Target | WebGL 2.0 | Memory: Clean');
      }
      toggleMatrixMode();
    } else {
      setLogoClicks(next);
      if (window.showToast) {
        window.showToast('SYSTEM LOGO', `Click ${5 - next} more times for Dev Mode!`);
      }
    }
  };

  return (
    <header>
      <a className="brand" id="brand-logo" title="Click 5 times for Dev Stats" onClick={handleLogoClick}>
        JALEEL<b>O</b> <span className="brand-badge">{SITE_CONFIG.version}</span>
      </a>
      <div className="meta">
        <span>{SITE_CONFIG.location}</span>
        <i className="pulse"></i>
        <span>SYSTEM ACTIVE</span>
      </div>
    </header>
  );
};
