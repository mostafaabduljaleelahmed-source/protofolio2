import React from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer>
      <span>{SITE_CONFIG.handle} / 2026</span>
      <span>Built in Cairo</span>
    </footer>
  );
};
