import React from 'react';
import { TerminalCLI } from './TerminalCLI';
import { SITE_CONFIG } from '../../config/siteConfig';
import { FileText, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="hero-playground" id="hero-section" aria-label="Candidate Overview & Hero Section" style={{ padding: '4rem 0 3rem 0' }}>
      <div className="hero-main-layout" style={{ maxWidth: '860px', margin: '0 left' }}>
        <div className="hero-copy">
          <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.9rem', borderRadius: '20px', background: 'rgba(56, 239, 125, 0.08)', border: '1px solid rgba(56, 239, 125, 0.2)', fontSize: '0.8rem', color: 'var(--emerald)', marginBottom: '1.5rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }}></span>
            Available for Software Engineering Roles & Internships
          </div>
          
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: '0.25rem', marginBottom: '1.5rem', color: '#ffffff' }}>
            Systems, Backend Architecture & <em style={{ fontStyle: 'normal', color: 'var(--accent)', background: 'linear-gradient(135deg, #ffffff 0%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Automation.</em>
          </h1>
          
          <p className="hero-subtitle" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', lineHeight: '1.65', color: 'var(--text-secondary)', maxWidth: '740px', marginBottom: '2rem' }}>
            I’m <strong>Mostafa Abduljaleel</strong>, a Computer Science student at Cairo University specializing in <strong>.NET 8 / C# REST APIs</strong>, high-performance relational databases, and autonomous AI automation workflows.
          </p>

          <div className="hero-cta-group" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="action primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.6rem',
                borderRadius: '8px',
                background: 'var(--accent)',
                color: '#000000',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.95rem',
                boxShadow: '0 4px 20px rgba(136, 217, 255, 0.25)',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease'
              }}
            >
              <FileText size={17} /> View Resume <ArrowUpRight size={16} />
            </a>

            <a
              href="#work"
              className="hero-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.6rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            >
              Explore Case Studies ↓
            </a>

            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="hero-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.4rem',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.95rem'
              }}
            >
              <Mail size={16} /> Direct Email
            </a>
          </div>

          {/* QUICK LINKS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', marginBottom: '2.5rem' }}>
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
            >
              <Github size={16} /> GitHub Profile
            </a>
            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>

          <div>
            <TerminalCLI />
          </div>
        </div>
      </div>
    </section>
  );
};


