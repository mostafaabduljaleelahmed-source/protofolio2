import React from 'react';
import { useUI } from '../../context/UIContext';

export const Toast: React.FC = () => {
  const { toast } = useUI();

  return (
    <div
      id="toast-notification"
      className={toast.visible ? 'show' : ''}
      role="status"
      aria-live="polite"
    >
      <strong id="toast-title">{toast.title || 'SYSTEM NOTICE'}</strong>
      <span id="toast-msg">{toast.msg || 'Operating Environment Ready.'}</span>
    </div>
  );
};
