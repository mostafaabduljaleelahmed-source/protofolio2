import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useAudio } from '../../context/AudioContext';
import { guestbookService } from '../../services/guestbookService';
import { Button } from '../common/Button';
import { X, Send, Eye, ShieldCheck, Globe } from 'lucide-react';

interface GuestbookFormModalProps {
  onSubmitted?: () => void;
}

export const GuestbookFormModal: React.FC<GuestbookFormModalProps> = ({ onSubmitted }) => {
  const { isGuestbookFormOpen, closeGuestbookForm, showToast } = useUI();
  const { playClick } = useAudio();

  const [authorName, setAuthorName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const country = guestbookService.detectCountry();

  if (!isGuestbookFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setIsSubmitting(true);

    const res = await guestbookService.submitEntry({
      authorName,
      company,
      linkedIn,
      content,
      honeypot
    });

    setIsSubmitting(false);

    if (res.success) {
      showToast('GUESTBOOK SIGNED', res.message);
      setAuthorName('');
      setCompany('');
      setLinkedIn('');
      setContent('');
      closeGuestbookForm();
      if (onSubmitted) onSubmitted();
    } else {
      showToast('SUBMISSION ERROR', res.message);
    }
  };

  return (
    <div
      className="active"
      id="cmdk-modal"
      onClick={closeGuestbookForm}
      role="dialog"
      aria-modal="true"
      aria-label="Sign Jaleelo Portfolio Guestbook"
    >
      <div
        className="cmdk-box guestbook-form-box"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '620px',
          width: '90%',
          padding: '2rem',
          borderRadius: '16px',
          background: 'rgba(8, 11, 18, 0.94)',
          border: '1px solid rgba(136, 217, 255, 0.2)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          color: 'var(--text-main)'
        }}
      >
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>
              Sign the Operating Environment Guestbook
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Leave your signature, thoughts, or connection note. Markdown supported.
            </p>
          </div>
          <button
            onClick={closeGuestbookForm}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* HONEYPOT INVISIBLE SPAM TRAP */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              tabIndex={-1}
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Your Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Company / Organization (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Microsoft / Open Source"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                LinkedIn Profile URL (Optional)
              </label>
              <input
                type="url"
                value={linkedIn}
                onChange={e => setLinkedIn(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Origin Country
              </label>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--accent)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Globe size={14} /> {country}
              </div>
            </div>
          </div>

          {/* SIGNATURE CONTENT INPUT OR PREVIEW */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Signature Note * (Markdown Supported: **bold**, *italic*, `code`, [link](url))
              </label>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Eye size={13} /> {isPreview ? 'Edit Text' : 'Live Preview'}
              </button>
            </div>

            {isPreview ? (
              <div
                style={{
                  minHeight: '100px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(136, 217, 255, 0.3)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  lineHeight: '1.5'
                }}
                dangerouslySetInnerHTML={{ __html: guestbookService.renderMarkdown(content || '*(No content entered yet)*') }}
              />
            ) : (
              <textarea
                required
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Share your thoughts on Mostafa's work, .NET architecture, or just leave a friendly note..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  resize: 'vertical'
                }}
              />
            )}
          </div>

          {/* SPAM NOTICE & ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} color="var(--emerald)" /> Submissions are held for admin review before publishing.
            </span>
            <Button variant="primary" type="submit" isLoading={isSubmitting} rightIcon={<Send size={14} />}>
              Submit Signature
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
