import React, { useState } from 'react';
import { SITE_CONFIG, ProjectCase } from '../../config/siteConfig';
import { analyticsService } from '../../services/analyticsService';
import { useAudio } from '../../context/AudioContext';
import { Github, ExternalLink, ChevronDown, ChevronUp, Cpu, CheckCircle, ShieldCheck, Layers, Workflow } from 'lucide-react';

export const Projects: React.FC = () => {
  const { playClick } = useAudio();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First project expanded by default for immediate recruiter value

  const handleToggle = (index: number, title: string) => {
    playClick();
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
      analyticsService.trackProjectView(title);
    }
  };

  return (
    <section className="scene work" id="work" aria-label="Engineering Case Studies">
      <div>
        <div className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Featured Systems & Architecture / 01
        </div>
        <h2 style={{ fontSize: '2.2rem', margin: '0.5rem 0 1.5rem 0' }}>
          Engineering Case Studies
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '720px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Every project below is documented as an architectural case study detailing the technical problem, system architecture, engineering challenges, trade-off decisions, and empirical results.
        </p>

        <div className="case-studies-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {SITE_CONFIG.projects.map((project: ProjectCase, idx: number) => {
            const isExpanded = expandedIndex === idx;

            return (
              <article
                key={idx}
                className="engineering-case-study"
                style={{
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: isExpanded ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.07)',
                  boxShadow: isExpanded ? '0 12px 30px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.25s ease',
                  overflow: 'hidden'
                }}
              >
                {/* CASE STUDY HEADER ROW */}
                <div
                  onClick={() => handleToggle(idx, project.title)}
                  style={{
                    padding: '1.5rem 1.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isExpanded ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    userSelect: 'none'
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleToggle(idx, project.title);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '1rem',
                        color: 'var(--accent)',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255,255,255,0.05)'
                      }}
                    >
                      {project.number}
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#ffffff' }}>{project.title}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {project.meta}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {project.technologies.slice(0, 3).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.04)',
                            color: 'var(--text-secondary)',
                            fontFamily: 'DM Mono, monospace'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {isExpanded ? <ChevronUp size={20} color="var(--accent)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* CASE STUDY EXPANDED BODY */}
                {isExpanded && (
                  <div style={{ padding: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    {/* SUMMARY & GOAL */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Executive Summary
                      </h4>
                      <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6' }}>
                        {project.summary}
                      </p>
                    </div>

                    {/* PROBLEM & GOAL GRID */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '1.75rem'
                      }}
                    >
                      <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <h5 style={{ margin: '0 0 0.5rem 0', color: '#ff6b6b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Cpu size={15} /> Problem Statement
                        </h5>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          {project.problem}
                        </p>
                      </div>

                      <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--emerald)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle size={15} /> Engineering Goal
                        </h5>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          {project.goal}
                        </p>
                      </div>
                    </div>

                    {/* SYSTEM ARCHITECTURE & DIAGRAM */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <h4 style={{ margin: '0 0 0.75rem 0', color: '#ffffff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={16} color="var(--purple)" /> System Architecture
                      </h4>
                      <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {project.architecture}
                      </p>

                      {project.architectureDiagram && (
                        <div
                          style={{
                            background: '#090d16',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '1.25rem',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '0.8rem',
                            color: 'var(--accent)',
                            overflowX: 'auto',
                            whiteSpace: 'pre',
                            lineHeight: '1.4'
                          }}
                        >
                          {project.architectureDiagram.join('\n')}
                        </div>
                      )}
                    </div>

                    {/* CHALLENGES & DECISIONS */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '1.75rem'
                      }}
                    >
                      <div>
                        <h5 style={{ margin: '0 0 0.75rem 0', color: '#ffffff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Workflow size={15} color="var(--orange)" /> Key Challenges
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                          {project.challenges.map((c, cIdx) => (
                            <li key={cIdx}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 style={{ margin: '0 0 0.75rem 0', color: '#ffffff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <ShieldCheck size={15} color="var(--emerald)" /> Architectural Decisions & Trade-offs
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                          {project.decisions.map((d, dIdx) => (
                            <li key={dIdx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* TECHNOLOGIES & RESULTS */}
                    <div style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Technologies & Libraries:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {project.technologies.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              style={{
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#ffffff',
                                fontFamily: 'DM Mono, monospace'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Quantifiable Outcomes:</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--emerald)' }}>
                          {project.results.map((res, rIdx) => (
                            <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>✓</span> <span>{res}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ACTION LINKS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {project.code && (
                        <a
                          href={project.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 500
                          }}
                        >
                          <Github size={14} /> Repository Code
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            background: 'var(--accent)',
                            color: '#000000',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          <ExternalLink size={14} /> Live Demonstration
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

