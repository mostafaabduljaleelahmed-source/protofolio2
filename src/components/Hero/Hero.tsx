import React, { useState } from 'react';
import { TerminalCLI } from './TerminalCLI';
import { SITE_CONFIG } from '../../config/siteConfig';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';

export const Hero: React.FC = () => {
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);

  const togglePanel = (id: string) => {
    setExpandedPanel(expandedPanel === id ? null : id);
  };

  const handleDiscover = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('discover-architect'));
  };

  return (
    <section className="hero-playground" id="hero-section" aria-label="Introduction Hero Section">
      <div className="slow-mo-aura" aria-hidden="true"></div>

      {/* HOTSPOTS LAYER */}
      <div className="hotspots-layer" aria-hidden="true">
        <div className="hotspot" style={{ top: '28%', left: '14%' }}>
          <div className="hotspot-pin"></div>
          <div className="hotspot-tooltip">.NET 8 / C#</div>
        </div>
        <div className="hotspot" style={{ top: '22%', right: '18%' }}>
          <div className="hotspot-pin"></div>
          <div className="hotspot-tooltip">Flutter / Mobile</div>
        </div>
        <div className="hotspot" style={{ top: '48%', right: '12%' }}>
          <div className="hotspot-pin"></div>
          <div className="hotspot-tooltip">AI / Automation</div>
        </div>
        <div className="hotspot" style={{ top: '65%', left: '10%' }}>
          <div className="hotspot-pin"></div>
          <div className="hotspot-tooltip">Backend Architecture</div>
        </div>
        <div className="hotspot" style={{ top: '72%', right: '28%' }}>
          <div className="hotspot-pin"></div>
          <div className="hotspot-tooltip">Cloud & SQL</div>
        </div>
      </div>

      {/* MAIN HERO CONTENT & LIVE PANELS */}
      <div className="hero-main-layout">
        <div className="hero-copy">
          <div className="eyebrow">{SITE_CONFIG.name} / {SITE_CONFIG.handle}</div>
          <h1 className="hero-title">
            The person behind<br />the <em>systems.</em>
          </h1>
          <p className="hero-subtitle">
            Full-stack .NET developer, AI automation builder, Flutter developer, and Computer Science student at Cairo University. Move your cursor or click below to discover the living environment.
          </p>

          <div className="hero-cta-group">
            <Button variant="primary" onClick={handleDiscover}>
              ✨ Discover Architect &#8594;
            </Button>
            <a href="#work" className="hero-btn">
              Explore Systems
            </a>
          </div>

          <TerminalCLI />
        </div>

        {/* RIGHT: LIVE FLOATING PANELS */}
        <div className="live-panels-container">
          <GlassCard
            interactive
            expanded={expandedPanel === 'stack'}
            onToggle={() => togglePanel('stack')}
            aria-label="Current Tech Stack Panel"
          >
            <div className="panel-header">
              <div className="panel-title">
                <i className="panel-status-dot" aria-hidden="true"></i> Current Stack
              </div>
              <Badge variant="live">LIVE</Badge>
            </div>
            <div className="panel-body">.NET 8 • C# • Flutter • Python • SQL</div>
            <div className="panel-tags">
              <Badge variant="tag">ASP.NET Core</Badge>
              <Badge variant="tag">Selenium</Badge>
              <Badge variant="tag">Claude API</Badge>
            </div>
            <div className="panel-expand-content">
              Architecting production-ready REST APIs, cross-platform mobile tools, and intelligent automation workflows.
            </div>
          </GlassCard>

          <GlassCard
            interactive
            expanded={expandedPanel === 'learning'}
            onToggle={() => togglePanel('learning')}
            aria-label="Now Exploring Panel"
          >
            <div className="panel-header">
              <div className="panel-title">
                <i className="panel-status-dot" style={{ background: 'var(--orange)', boxShadow: '0 0 8px var(--orange)' }} aria-hidden="true"></i> Now Exploring
              </div>
              <Badge variant="active">ACTIVE</Badge>
            </div>
            <div className="panel-body">LLM Agents & Distributed Systems</div>
            <div className="panel-expand-content">
              Investigating autonomous agent loops, microservice patterns, and multi-model LLM classification pipelines.
            </div>
          </GlassCard>

          <GlassCard
            interactive
            expanded={expandedPanel === 'projects'}
            onToggle={() => togglePanel('projects')}
            aria-label="Current Focus Panel"
          >
            <div className="panel-header">
              <div className="panel-title">
                <i className="panel-status-dot" style={{ background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }} aria-hidden="true"></i> Current Focus
              </div>
              <Badge variant="shipped">SHIPPED</Badge>
            </div>
            <div className="panel-body">EduSphere / Tutoring OS</div>
            <div className="panel-expand-content">
              Full-stack backend & role-based management platform built with .NET 8, C#, and SQL Server.
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
