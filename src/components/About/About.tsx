import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="scene about" id="philosophy">
      <div>
        <div className="eyebrow">System philosophy / 03</div>
        <div className="philosophy">
          <div>
            <h2>Clear contracts.<br />Deterministic output.<br />No magic.</h2>
            <p className="manifesto">
              I believe software engineering should eliminate ambiguity. Whether it is an API endpoint, a Flutter screen, or an AI workflow—reliability comes from structure.
            </p>
          </div>
          <div className="pillars">
            <div className="pillar">
              <h3>01 / Architecture First</h3>
              <p>Designing backend schemas and data contracts before writing code prevents refactoring cycles and technical debt.</p>
            </div>
            <div className="pillar">
              <h3>02 / Automation as Leverage</h3>
              <p>Repeated human tasks are engineering failures. I automate workflows using Python, Selenium, and LLMs.</p>
            </div>
            <div className="pillar">
              <h3>03 / User Precision</h3>
              <p>Interfaces should be fast, crisp, and tactile. Micro-interactions and subtle audio feedback turn apps into instruments.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
