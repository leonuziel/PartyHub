import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  display?: 'flex' | 'grid';
  flexDirection?: 'row' | 'column';
  gap?: number;
  alignItems?: string;
  justifyContent?: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  display = 'flex',
  flexDirection = 'column',
  gap = 0,
  alignItems,
  justifyContent,
  backgroundColor,
  padding,
  borderRadius,
  border,
  className = '',
  style: propStyle = {},
}) => {
  const style: React.CSSProperties = {
    display,
    flexDirection,
    gap: `${gap}px`,
    alignItems,
    justifyContent,
    backgroundColor,
    padding,
    borderRadius,
    border,
    ...propStyle,
  };

  return (
    <div data-testid="container" style={style} className={className}>
      {children}
    </div>
  );
};
