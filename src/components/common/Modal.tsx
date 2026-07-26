import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  ariaLabel: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerIcon,
  headerExtra,
  children,
  maxWidth = '680px',
  ariaLabel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="active modal-backdrop"
      id="cmdk-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className="cmdk-box modal-container"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth, width: '90%' }}
      >
        {title && (
          <div className="modal-header">
            <div>
              <div className="modal-title-row">
                {headerIcon && <span className="modal-header-icon">{headerIcon}</span>}
                <h3 className="modal-title">{title}</h3>
              </div>
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
            </div>

            <div className="modal-header-actions">
              {headerExtra}
              <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
