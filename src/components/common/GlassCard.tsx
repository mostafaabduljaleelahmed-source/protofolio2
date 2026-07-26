import React, { HTMLAttributes } from 'react';
import { useAudio } from '../../context/AudioContext';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = false,
  expanded = false,
  onToggle,
  className = '',
  onClick,
  onKeyDown,
  ...props
}) => {
  const { playHover, playClick } = useAudio();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive) {
      playClick();
      if (onToggle) onToggle();
    }
    if (onClick) onClick(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      playClick();
      if (onToggle) onToggle();
    }
    if (onKeyDown) onKeyDown(e);
  };

  const handleMouseEnter = () => {
    if (interactive) playHover();
  };

  return (
    <div
      className={`live-panel ${expanded ? 'expanded' : ''} ${interactive ? 'interactive' : ''} ${className}`.trim()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-expanded={interactive ? expanded : undefined}
      {...props}
    >
      {children}
    </div>
  );
};
