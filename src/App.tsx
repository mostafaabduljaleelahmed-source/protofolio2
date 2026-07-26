import React, { useEffect, Suspense, lazy } from 'react';
import { UIProvider, useUI } from './context/UIContext';
import { AudioProvider } from './context/AudioContext';
import { WorldCanvas } from './three/WorldCanvas';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Projects } from './components/Projects/Projects';
import { Experiments } from './components/Experiments/Experiments';
import { GuestbookSection } from './components/Guestbook/GuestbookSection';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { Toast } from './components/Toast/Toast';
import { Loader } from './components/Loader/Loader';
import { initCustomCursor } from './utils/cursor';
import { analyticsService } from './services/analyticsService';
import { easterEggService } from './services/easterEggService';

// Lazy-loaded interactive modals for optimized main-thread parsing
const CommandPalette = lazy(() =>
  import('./components/CommandPalette/CommandPalette').then(m => ({ default: m.CommandPalette }))
);
const AIChat = lazy(() =>
  import('./components/AIChat/AIChat').then(m => ({ default: m.AIChat }))
);
const GuestbookFormModal = lazy(() =>
  import('./components/Guestbook/GuestbookFormModal').then(m => ({ default: m.GuestbookFormModal }))
);
const GuestbookAdminModal = lazy(() =>
  import('./components/Guestbook/GuestbookAdminModal').then(m => ({ default: m.GuestbookAdminModal }))
);
const AdminPanelModal = lazy(() =>
  import('./components/Admin/AdminPanelModal').then(m => ({ default: m.AdminPanelModal }))
);
const AchievementsModal = lazy(() =>
  import('./components/EasterEggs/AchievementsModal').then(m => ({ default: m.AchievementsModal }))
);

const PortfolioAppContent: React.FC = () => {
  const { showToast } = useUI();

  useEffect(() => {
    const cleanupCursor = initCustomCursor();
    const cleanupKonami = easterEggService.init(showToast);
    analyticsService.trackPageView();

    return () => {
      cleanupCursor();
      cleanupKonami();
    };
  }, [showToast]);

  return (
    <>
      {/* CUSTOM CURSOR ACCESSIBLE TARGETS */}
      <div id="custom-cursor" aria-hidden="true"></div>
      <div id="cursor-dot" aria-hidden="true"></div>

      {/* MATRIX CANVAS OVERLAY */}
      <canvas id="matrix-canvas" aria-hidden="true"></canvas>

      {/* 3D LIVING WORLD CANVAS & GRAIN */}
      <WorldCanvas />
      <div className="grain" aria-hidden="true"></div>

      {/* OPERATING ENVIRONMENT BOOT LOADER */}
      <Loader />

      {/* HEADER & MAIN SECTIONS */}
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Experiments />
        <GuestbookSection />
        <Contact />
      </main>

      <Footer />

      {/* INTERACTIVE MODALS & WIDGETS WITH SUSPENSE FALLBACK */}
      <Suspense fallback={null}>
        <CommandPalette />
        <AIChat />
        <GuestbookFormModal />
        <GuestbookAdminModal />
        <AdminPanelModal />
        <AchievementsModal />
      </Suspense>
      <Toast />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <UIProvider>
      <AudioProvider>
        <PortfolioAppContent />
      </AudioProvider>
    </UIProvider>
  );
};
