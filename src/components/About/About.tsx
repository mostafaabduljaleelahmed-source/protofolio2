import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="scene about" id="philosophy">
      <div>
        <div className="eyebrow">Engineering Philosophy / 02</div>
        <div className="philosophy">
          <div>
            <h2>Clear contracts.<br />Deterministic output.<br />No magic.</h2>
            <p className="manifesto">
              Software engineering is about eliminating ambiguity. Reliability comes from strong schema contracts, predictable API state management, and clear technical boundaries.
            </p>
          </div>
          <div className="pillars">
            <div className="pillar">
              <h3>01 / Schema & Architecture First</h3>
              <p>Designing backend schemas, domain models, and API data contracts before writing code prevents refactoring churn and technical debt.</p>
            </div>
            <div className="pillar">
              <h3>02 / Automation as Leverage</h3>
              <p>Repetitive manual tasks represent system design opportunities. I automate processes using Python scripts, webhooks, and AI agent workflows.</p>
            </div>
            <div className="pillar">
              <h3>03 / User & API Precision</h3>
              <p>Systems should be responsive, fast, and reliable. Strict input validation and sub-100ms API responses create authentic developer trust.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

