import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsSummary } from '../../types';
import { Modal } from '../common/Modal';
import { Activity, Globe, Eye, Users, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { isAnalyticsOpen, closeAnalytics } = useUI();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = async () => {
    setLoading(true);
    const data = await analyticsService.getSummary();
    setSummary(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAnalyticsOpen) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [isAnalyticsOpen]);

  return (
    <Modal
      isOpen={isAnalyticsOpen}
      onClose={closeAnalytics}
      title="Realtime Telemetry & Audience Analytics"
      subtitle="Privacy-first analytics • Zero PII stored • Live WebSocket & REST pulse"
      headerIcon={<Activity size={20} color="var(--accent)" />}
      headerExtra={
        <button
          onClick={fetchMetrics}
          title="Refresh Telemetry"
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
        </button>
      }
      maxWidth="820px"
      ariaLabel="Realtime Analytics Dashboard"
    >
      {/* METRICS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={14} /> Total Visitors
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
            {summary ? summary.totalVisitors : '—'}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <Activity size={14} /> Today's Visitors
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)' }}>
            {summary ? summary.todayVisitors : '—'}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <Clock size={14} /> Avg Session
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--orange)' }}>
            {summary ? `${summary.avgSessionSeconds}s` : '—'}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> Returning Ratio
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>
            {summary ? `${summary.returningRatio}%` : '—'}
          </div>
        </div>
      </div>

      {/* DETAILED BREAKDOWN PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.75rem' }}>
            <Globe size={15} /> Top Geographic Origins
          </div>
          {summary?.topCountries.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
              <span>{c.country}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{c.count} views</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--emerald)', marginBottom: '0.75rem' }}>
            <Users size={15} /> Top Traffic Sources
          </div>
          {summary?.topReferrers.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
              <span>{r.referrer}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--emerald)' }}>{r.count}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--orange)', marginBottom: '0.75rem' }}>
            <Eye size={15} /> Top Viewed Projects
          </div>
          {summary?.topProjects.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
              <span style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.projectTitle}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--orange)' }}>{p.count} clicks</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER METADATA */}
      <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        <span>Last Telemetry Sync: {summary?.lastVisitTime || 'Just Now'}</span>
        <span>Engine Status: Supabase Realtime Active</span>
      </div>
    </Modal>
  );
};
