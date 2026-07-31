import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { useUI } from '../../context/UIContext';
import { useAudio } from '../../context/AudioContext';
import { easterEggService } from '../../services/easterEggService';
import { PenTool, FileText, Terminal, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { showToast, openCommandPalette, openGuestbookForm, openPinModal } = useUI();
  const { playClick } = useAudio();
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('top');

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['work', 'philosophy', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('top');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (sectionId: string) => {
    playClick();
    setIsMobileMenuOpen(false);
    setActiveSection(sectionId);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" id="brand-logo" title="Mostafa Abduljaleel Portfolio" onClick={handleLogoClick} href="#top">
          MOSTAFA <b>ABDULJALEEL</b> <span className="brand-badge">{SITE_CONFIG.version}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-only" aria-label="Main Navigation">
          <a
            href="#work"
            className={`nav-link ${activeSection === 'work' ? 'active' : ''}`}
            onClick={() => handleNavClick('work')}
          >
            Projects
          </a>
          <a
            href="#philosophy"
            className={`nav-link ${activeSection === 'philosophy' ? 'active' : ''}`}
            onClick={() => handleNavClick('philosophy')}
          >
            Philosophy
          </a>
          <a
            href="#contact"
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => handleNavClick('contact')}
          >
            Contact
          </a>
        </nav>

        {/* Desktop Header Actions */}
        <div className="header-controls desktop-only">
          <a
            href={SITE_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="header-btn"
            title="View Resume Document"
            aria-label="Download Resume"
          >
            <FileText size={14} color="var(--accent)" /> Resume
          </a>

          <button
            className="header-btn"
            onClick={() => {
              playClick();
              openGuestbookForm();
            }}
            title="Sign Environment Guestbook"
            aria-label="Sign Guestbook"
          >
            <PenTool size={14} /> Guestbook
          </button>

          <button
            className="header-btn"
            onClick={() => {
              playClick();
              openCommandPalette();
            }}
            title="Open Command Palette (Ctrl+K / Cmd+K)"
            aria-label="Open Command Palette"
          >
            <Terminal size={13} /> ⌘K
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button (min 48px touch target) */}
        <button
          className="mobile-hamburger-btn mobile-only"
          onClick={() => {
            playClick();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-drawer-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className="mobile-drawer-content"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="drawer-header">
            <a className="brand" onClick={handleLogoClick} href="#top">
              MOSTAFA <b>ABDULJALEEL</b>
            </a>
            <button
              className="drawer-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="mobile-drawer-nav">
            <a
              href="#work"
              className={`drawer-link ${activeSection === 'work' ? 'active' : ''}`}
              onClick={() => handleNavClick('work')}
            >
              <span className="drawer-link-number">01</span> Projects
            </a>
            <a
              href="#philosophy"
              className={`drawer-link ${activeSection === 'philosophy' ? 'active' : ''}`}
              onClick={() => handleNavClick('philosophy')}
            >
              <span className="drawer-link-number">02</span> Philosophy
            </a>
            <a
              href="#contact"
              className={`drawer-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
            >
              <span className="drawer-link-number">03</span> Contact
            </a>
          </nav>

          <div className="mobile-drawer-actions">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-action-btn primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText size={18} /> View Resume
            </a>

            <button
              className="drawer-action-btn"
              onClick={() => {
                playClick();
                setIsMobileMenuOpen(false);
                openGuestbookForm();
              }}
            >
              <PenTool size={18} /> Sign Guestbook
            </button>

            <button
              className="drawer-action-btn"
              onClick={() => {
                playClick();
                setIsMobileMenuOpen(false);
                openCommandPalette();
              }}
            >
              <Terminal size={18} /> Command Palette (⌘K)
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


