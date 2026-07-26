import React, { ButtonHTMLAttributes } from 'react';
import { useAudio } from '../../context/AudioContext';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const { playClick } = useAudio();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    playClick();
    if (onClick) onClick(e);
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'hero-btn primary';
      case 'ghost': return 'action ghost-btn';
      case 'icon': return 'header-btn icon-btn';
      default: return 'hero-btn';
    }
  };

  return (
    <button
      className={`${getVariantClass()} ${className}`.trim()}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" aria-hidden="true" style={{ display: 'inline-block', marginRight: '6px' }}>⏳</span>
      ) : leftIcon ? (
        <span className="btn-icon left" aria-hidden="true" style={{ marginRight: '6px' }}>{leftIcon}</span>
      ) : null}

      <span>{children}</span>

      {rightIcon && !isLoading && (
        <span className="btn-icon right" aria-hidden="true" style={{ marginLeft: '6px' }}>{rightIcon}</span>
      )}
    </button>
  );
};
