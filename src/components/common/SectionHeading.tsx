import React, { HTMLAttributes } from 'react';

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  className = '',
  ...props
}) => {
  return (
    <div className={`section-heading ${className}`.trim()} {...props}>
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {subtitle && <p className="lede">{subtitle}</p>}
    </div>
  );
};
