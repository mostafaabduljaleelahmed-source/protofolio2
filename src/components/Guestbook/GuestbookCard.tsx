import React from 'react';
import { GuestbookEntry } from '../../types';
import { guestbookService } from '../../services/guestbookService';
import { Globe, Linkedin, Building2, CheckCircle2, Clock, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';

interface GuestbookCardProps {
  entry: GuestbookEntry;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, currentContent: string) => void;
}

export const GuestbookCard: React.FC<GuestbookCardProps> = ({
  entry,
  isAdmin = false,
  onApprove,
  onDelete,
  onEdit,
}) => {
  const renderedContent = guestbookService.renderMarkdown(entry.content);

  return (
    <article
      className="guestbook-card"
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: entry.status === 'pending' ? '1px dashed var(--orange)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* CARD HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              {entry.authorName}
            </h4>

            {entry.linkedIn && (
              <a
                href={entry.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                style={{ color: '#0077b5', display: 'flex', alignItems: 'center' }}
                aria-label={`${entry.authorName}'s LinkedIn Profile`}
              >
                <Linkedin size={15} />
              </a>
            )}

            {entry.company && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Building2 size={13} /> {entry.company}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={12} /> {entry.country}
            </span>
            <span>•</span>
            <time dateTime={entry.createdAt}>
              {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div>
          {entry.status === 'approved' ? (
            <Badge variant="shipped" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(56, 239, 125, 0.1)', color: 'var(--emerald)' }}>
              <CheckCircle2 size={12} /> Approved
            </Badge>
          ) : (
            <Badge variant="active" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(232, 154, 97, 0.15)', color: 'var(--orange)' }}>
              <Clock size={12} /> Pending Review
            </Badge>
          )}
        </div>
      </div>

      {/* MARKDOWN CONTENT */}
      <div
        className="guestbook-markdown-body"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
        style={{
          fontSize: '0.9rem',
          lineHeight: '1.55',
          color: 'var(--text-main)',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      />

      {/* ADMIN CONTROLS ROW */}
      {isAdmin && (
        <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          {entry.status === 'pending' && onApprove && (
            <button
              onClick={() => onApprove(entry.id)}
              style={{ background: 'rgba(56, 239, 125, 0.2)', border: '1px solid var(--emerald)', color: 'var(--emerald)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <CheckCircle2 size={13} /> Approve
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(entry.id, entry.content)}
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Edit3 size={13} /> Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              style={{ background: 'rgba(255, 77, 77, 0.15)', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
};
