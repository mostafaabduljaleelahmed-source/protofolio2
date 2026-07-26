import React from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { analyticsService } from '../../services/analyticsService';
import { useAudio } from '../../context/AudioContext';

export const Projects: React.FC = () => {
  const { playClick } = useAudio();

  const handleProjectClick = (title: string) => {
    playClick();
    analyticsService.trackProjectView(title);
  };

  return (
    <section className="scene work" id="work" aria-label="Production Case Studies">
      <div>
        <div className="eyebrow">Production case files / 04</div>
        <h2>Engineering solutions for real-world pressure.</h2>
        <div className="cases-grid">
          {SITE_CONFIG.projects.map((project, idx) => (
            <article
              className="case-file"
              key={idx}
              onClick={() => handleProjectClick(project.title)}
              style={{ cursor: 'pointer' }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleProjectClick(project.title);
                }
              }}
              aria-label={`Project Case Study: ${project.title}`}
            >
              <span className="case-number">{project.number}</span>
              <div>
                <h3>{project.title}</h3>
                <div className="case-meta">{project.meta}</div>
                <div className="case-copy">
                  <p><b>The pressure: </b>{project.pressure}</p>
                  <p><b>The response: </b>{project.response}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
