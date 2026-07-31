import React from 'react';
import { TerminalCLI } from './TerminalCLI';
import { SITE_CONFIG } from '../../config/siteConfig';
import { FileText, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="hero-playground" id="hero-section" aria-label="Candidate Overview & Hero Section">
      <div className="hero-main-layout">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow">
            <span className="pulse-dot"></span>
            Available for Software Engineering Roles & Internships
          </div>
          
          <h1 className="hero-title">
            Systems, Backend Architecture & <em className="hero-accent-text">AI Automation.</em>
          </h1>
          
          <p className="hero-subtitle">
            I’m <strong>Mostafa Abduljaleel</strong>, a Computer Science student at Cairo University specializing in <strong>.NET 8 / C# REST APIs</strong>, high-performance relational databases, and autonomous AI automation workflows.
          </p>

          <div className="hero-cta-group">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn primary"
            >
              <FileText size={18} /> View Resume <ArrowUpRight size={16} />
            </a>

            <a
              href="#work"
              className="hero-btn secondary"
            >
              Explore Case Studies ↓
            </a>

            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="hero-btn ghost"
            >
              <Mail size={16} /> Direct Email
            </a>
          </div>

          {/* QUICK LINKS */}
          <div className="hero-quick-links">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-link"
            >
              <Github size={18} /> GitHub Profile
            </a>
            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-link"
            >
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>

          <div className="hero-terminal-wrapper">
            <TerminalCLI />
          </div>
        </div>
      </div>
    </section>
  );
};



