import React from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';

export const Experiments: React.FC = () => {
  return (
    <section className="scene lab" id="experiments">
      <div>
        <div className="eyebrow">Experiment field / 05</div>
        <h2>Automate the boring. Keep the human part human.</h2>
        <div className="signals">
          {SITE_CONFIG.experiments.map((exp, idx) => (
            <article className="signal" key={idx}>
              <small>{exp.tag}</small>
              <h3>{exp.title}</h3>
              <p>{exp.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
