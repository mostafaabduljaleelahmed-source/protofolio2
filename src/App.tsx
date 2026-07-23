import React, { useEffect } from 'react';
import { WorldCanvas } from './three/WorldCanvas';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Projects } from './components/Projects/Projects';
import { Experiments } from './components/Experiments/Experiments';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { AIChat } from './components/AIChat/AIChat';
import { Toast } from './components/Toast/Toast';
import { Loader } from './components/Loader/Loader';
import { initCustomCursor } from './utils/cursor';
import { audioEngine } from './utils/audioEngine';

export const App: React.FC = () => {
  useEffect(() => {
    const cleanupCursor = initCustomCursor();

    const handleFirstInteraction = () => {
      audioEngine.init();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      cleanupCursor();
    };
  }, []);

  return (
    <>
      {/* CUSTOM CURSOR */}
      <div id="custom-cursor"></div>
      <div id="cursor-dot"></div>

      {/* MATRIX CANVAS OVERLAY */}
      <canvas id="matrix-canvas"></canvas>

      {/* 3D LIVING WORLD CANVAS & GRAIN */}
      <WorldCanvas />
      <div className="grain" aria-hidden="true"></div>

      {/* OPERATING ENVIRONMENT BOOT LOADER */}
      <Loader />

      {/* HEADER & MAIN SECTIONS */}
      <Header />
      <main id="top">
        <Hero />
        <About />
        <Projects />
        <Experiments />
        <Contact />
      </main>

      <Footer />

      {/* INTERACTIVE MODALS & WIDGETS */}
      <CommandPalette />
      <AIChat />
      <Toast />
    </>
  );
};
