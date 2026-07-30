import React from 'react';
import { TerminalCLI } from './TerminalCLI';
import { SITE_CONFIG } from '../../config/siteConfig';
import { FileText, Github, Linkedin, Mail, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="hero-playground" id="hero-section" aria-label="Candidate Overview & Hero Section">
      {/* MAIN HERO CONTENT & PORTRAIT CARD */}
      <div className="hero-main-layout">
        <div className="hero-copy">
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
            Available for Software Engineering Roles & Internships
          </div>
          
          <h1 className="hero-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Systems, Backend Architecture & <em>AI Automation.</em>
          </h1>
          
          <p className="hero-subtitle" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            I’m <strong>Mostafa Abduljaleel</strong>, a Computer Science student at Cairo University specializing in <strong>.NET 8 / C# REST APIs</strong>, high-performance relational databases, and autonomous AI automation pipelines.
          </p>

          <div className="hero-cta-group" style={{ margin: '1.75rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="action primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: '6px',
                background: 'var(--accent)',
                color: '#000',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              <FileText size={16} /> View Resume <ArrowUpRight size={15} />
            </a>

            <a
              href="#work"
              className="hero-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem'
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
                padding: '0.75rem 1.2rem',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              <Mail size={15} /> Email Direct
            </a>
          </div>

          {/* QUICK LINKS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <Github size={15} /> GitHub Profile
            </a>
            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <Linkedin size={15} /> LinkedIn
            </a>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <TerminalCLI />
          </div>
        </div>

        {/* RIGHT: AUTHENTIC ENGINEER PORTRAIT CARD */}
        <div className="portrait-card-container" style={{ flexShrink: 0, width: '100%', maxWidth: '360px' }}>
          <div
            style={{
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            {/* PORTRAIT IMAGE */}
            <div
              style={{
                width: '100%',
                height: '240px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                background: '#111',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '1.25rem'
              }}
            >
              <img
                src={SITE_CONFIG.avatarUrl}
                alt="Mostafa Abduljaleel - Software Engineer"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.05) brightness(0.95)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.75rem',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
                Cairo, Egypt
              </div>
            </div>

            {/* CANDIDATE QUICK SUMMARY */}
            <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.15rem', color: '#fff' }}>{SITE_CONFIG.name}</h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Faculty of Computers & Artificial Intelligence, Cairo University
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={14} color="var(--accent)" />
                <span><strong>Core:</strong> .NET 8, C#, SQL Server, REST API</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={14} color="var(--emerald)" />
                <span><strong>Automation:</strong> Python, Selenium, Playwright</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={14} color="var(--purple)" />
                <span><strong>Mobile & AI:</strong> Flutter, Claude API Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

