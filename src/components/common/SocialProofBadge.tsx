import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { PublicSocialProof } from '../../types';
import { Users, Globe, Briefcase } from 'lucide-react';

export const SocialProofBadge: React.FC = () => {
  const [proof, setProof] = useState<PublicSocialProof | null>(null);

  useEffect(() => {
    analyticsService.getPublicSocialProof().then(setProof).catch(() => {});
  }, []);

  if (!proof) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '0.6rem 1.2rem',
        borderRadius: '999px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        margin: '1rem 0'
      }}
      aria-label="Public Social Proof Statistics"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Users size={14} color="var(--accent)" />
        <span style={{ fontWeight: 700, color: '#fff', fontFamily: 'DM Mono, monospace' }}>
          {proof.totalVisitors.toLocaleString()}+
        </span>
        <span style={{ color: 'var(--text-muted)' }}>Visitors</span>
      </div>

      <div style={{ width: '1px', height: '12px', background: 'rgba(255, 255, 255, 0.15)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Globe size={14} color="var(--emerald)" />
        <span style={{ fontWeight: 700, color: '#fff', fontFamily: 'DM Mono, monospace' }}>
          {proof.countriesCount}+
        </span>
        <span style={{ color: 'var(--text-muted)' }}>Countries</span>
      </div>

      <div style={{ width: '1px', height: '12px', background: 'rgba(255, 255, 255, 0.15)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Briefcase size={14} color="var(--purple)" />
        <span style={{ fontWeight: 700, color: '#fff', fontFamily: 'DM Mono, monospace' }}>
          {proof.projectsCompleted}+
        </span>
        <span style={{ color: 'var(--text-muted)' }}>Projects</span>
      </div>
    </div>
  );
};
