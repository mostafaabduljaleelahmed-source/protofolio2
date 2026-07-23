import React from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';

export const Projects: React.FC = () => {
  return (
    <section className="scene work" id="work">
      <div>
        <div className="eyebrow">Production case files / 04</div>
        <h2>Engineering solutions for real-world pressure.</h2>
        <div className="cases-grid">
          {SITE_CONFIG.projects.map((project, idx) => (
            <article className="case-file" key={idx}>
              <span className="case-number">{project.number}</span>
              <div>
                <h3>{project.title}</h3>
                <div className="case-meta">{project.meta}</div>
                <div className="case-copy">
                  <p><b>The pressure</b>{project.pressure}</p>
                  <p><b>The response</b>{project.response}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
