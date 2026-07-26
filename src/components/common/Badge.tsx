import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'live' | 'active' | 'shipped' | 'tag' | 'brand';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'tag',
  className = '',
  ...props
}) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'live':
      case 'active':
      case 'shipped':
        return 'mono';
      case 'brand':
        return 'brand-badge';
      default:
        return 'panel-tag';
    }
  };

  return (
    <span className={`${getBadgeClass()} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
};
