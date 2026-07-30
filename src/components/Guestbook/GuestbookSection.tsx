import React, { useState, useEffect } from 'react';
import { guestbookService } from '../../services/guestbookService';
import { GuestbookEntry } from '../../types';
import { GuestbookCard } from './GuestbookCard';
import { useUI } from '../../context/UIContext';
import { Button } from '../common/Button';
import { SectionHeading } from '../common/SectionHeading';
import { PenTool, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuestbookSection: React.FC = () => {
  const { openGuestbookForm, openGuestbookAdmin } = useUI();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEntries = async () => {
    setLoading(true);
    const data = await guestbookService.fetchApprovedEntries();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
    const unsubscribe = guestbookService.subscribe(() => {
      fetchEntries();
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="scene guestbook" id="guestbook" aria-label="Operating Environment Guestbook">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <SectionHeading
            eyebrow="Community Ledger / 05"
            title={
              <>
                Operating Environment <span>Guestbook.</span>
              </>
            }
            subtitle="Signatures, thoughts, and connections from software engineers, architects, and visitors worldwide."
          />

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="primary"
              onClick={openGuestbookForm}
              leftIcon={<PenTool size={15} />}
            >
              Sign Guestbook
            </Button>
          </div>
        </div>

        {/* FEED GRID */}
        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '2rem 0' }}>
            Loading approved signatures...
          </div>
        ) : entries.length === 0 ? (
          <div
            style={{
              padding: '2.5rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.08)',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <MessageSquare size={32} style={{ margin: '0 auto 0.75rem auto', color: 'var(--accent)', opacity: 0.7 }} />
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Be the first to sign the Guestbook!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}
          >
            {entries.map((entry) => (
              <GuestbookCard key={entry.id} entry={entry} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
