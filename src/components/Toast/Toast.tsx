import React, { useState, useEffect } from 'react';

interface ToastData {
  title: string;
  msg: string;
}

export const Toast: React.FC = () => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    window.showToast = (title: string, msg: string) => {
      setToast({ title, msg });
      setVisible(true);
      if (window.toastTimer) clearTimeout(window.toastTimer);
      window.toastTimer = window.setTimeout(() => {
        setVisible(false);
      }, 4000);
    };
  }, []);

  return (
    <div id="toast-notification" className={visible ? 'show' : ''}>
      <strong id="toast-title">{toast?.title || 'SYSTEM NOTICE'}</strong>
      <span id="toast-msg">{toast?.msg || 'Interactive Playground Loaded.'}</span>
    </div>
  );
};
