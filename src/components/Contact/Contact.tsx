import React from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';

export const Contact: React.FC = () => {
  return (
    <section className="scene contact" id="contact">
      <div className="eyebrow">Connection established / 06</div>
      <h2>Have a system that should work <span>better?</span></h2>
      <p className="lede">I am open to internships, freelance opportunities, and difficult problems worth simplifying.</p>
      <div className="actions">
        <a className="action primary" href={`mailto:${SITE_CONFIG.email}`}>Start a conversation</a>
        <a className="action" href={SITE_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a className="action" href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="action" href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </section>
  );
};
